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
    const query = `select * from \`${datasetId}.${tableId}\` where id in (select concat(concat(pilotname, '_'), FORMAT_DATETIME('%G%m%d%H%M%S', lastTime)) as idstr from \`${datasetId}.${tableId}\`) order by startTime desc`;

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
        try {
            const filePath = `paths/${oldId}.json.gz`;
            const file = storage.bucket(bucketName).file(filePath);
            await file.move(`paths/${newId}.json.gz`);
        } catch (error) {
            console.error(`Error moving ${oldId}.json.gz`);
            console.error(error);
            continue;
        }
        console.log(`Moved ${oldId}.json.gz`);
    }
}

listRowsAndCheckFiles().catch(console.error);
