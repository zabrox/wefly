const dayjs = require('dayjs');
const { Firestore } = require('@google-cloud/firestore');
const { BigQuery } = require('@google-cloud/bigquery');
const { Metadata } = require('./metadata.js');

const firestore = new Firestore();
const bigQuery = new BigQuery();

const datasetId = 'wefly';
const tableId = 'metadata';

function convertFromFirestoreObject(obj) {
    const metadata = Metadata.deserialize(obj);
    metadata.startTime = dayjs(obj.startTime.toDate());
    metadata.lastTime = dayjs(obj.lastTime.toDate());
    return metadata;
}

async function transferData() {
    const snapshot = await firestore.collection('metadatas').get();
    const rowsToInsert = snapshot.docs.map(doc => {
        const metadata = convertFromFirestoreObject(doc.data());
        if (metadata.startTime.year() <= 2023) {
            return;
        }
        return {
            id: metadata.getId(),
            pilotname: metadata.pilotname,
            distance: metadata.distance,
            duration: metadata.duration,
            maxAltitude: metadata.maxAltitude,
            startTime: metadata.startTime.format('YYYY-MM-DD HH:mm:ss'),
            lastTime: metadata.lastTime.format('YYYY-MM-DD HH:mm:ss'),
            startLongitude: metadata.startPosition[0],
            startLatitude: metadata.startPosition[1],
            startAltitude: metadata.startPosition[2],
            lastLongitude: metadata.lastPosition[0],
            lastLatitude: metadata.lastPosition[1],
            lastAltitude: metadata.lastPosition[2],
            activity: metadata.activity,
            model: metadata.model,
            area: metadata.area,
        };
    });

    // BigQueryにデータを挿入
    try {
        await bigQuery
            .dataset(datasetId)
            .table(tableId)
            .insert(rowsToInsert);
        console.log(`Inserted ${rowsToInsert.length} rows`);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

transferData().catch(console.error);
