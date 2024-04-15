const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const bigquery = new BigQuery();
const storage = new Storage();

const datasetId = 'wefly';
const tableId = 'metadatas';
const bucketName = 'wefly-lake';

class Metadata {
    id = '';
    pilotname = '';
    startTime = undefined;
}

async function listRowsAndCheckFiles() {
    const query = `SELECT id, pilotname, startTime, lastTime FROM \`${datasetId}.${tableId}\``;

    // BigQueryからデータを取得
    const [rows] = await bigquery.query(query);

    for (const row of rows) {
        const metadata = new Metadata();
        metadata.id = row.id;
        metadata.pilotname = row.pilotname;
        metadata.startTime = dayjs.utc(row.startTime.value);
        metadata.lastTime = dayjs.utc(row.lastTime.value);

        const oldId = `${metadata.pilotname}_${metadata.lastTime.format('YYYYMMDDHHmmss')}`;
        const newId = `${metadata.pilotname}_${metadata.startTime.format('YYYYMMDDHHmmss')}`;
        const query = `UPDATE \`${datasetId}.${tableId}\` SET id = '${newId}' WHERE id = '${oldId}'`;
        await bigquery.query(query);
        console.log(`Updated id for ${metadata.pilotname} ${metadata.startTime}`);

        const filePath = `paths/${oldId}.json.gz`;
        const file = storage.bucket(bucketName).file(filePath);
        await file.move(`paths/${newId}.json.gz`);
        console.log(`Moved ${metadata.id}.json.gz`);
    }
}

listRowsAndCheckFiles().catch(console.error);
