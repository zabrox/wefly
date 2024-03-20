const { BigQuery } = require('@google-cloud/bigquery');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

const bigQuery = new BigQuery();
const datasetId = 'wefly';
const oldTable = 'metadata';
const newTable = 'metadatas';

async function transferData() {
    const ids = new Set();
    const query = `SELECT * FROM \`${datasetId}.${oldTable}\``;
    const [job] = await bigQuery.createQueryJob({ query: query });
    const [rows] = await job.getQueryResults();

    for (const row of rows) {
        if (ids.has(row.id)) {
            continue;
        }
        ids.add(row.id);
        const startTime = dayjs(row.startTime.value);
        const endTime = dayjs(row.lastTime.value);
        const insertQuery = `INSERT INTO \`${datasetId}.${newTable}\` (
            id, pilotname, distance, duration, maxAltitude, startTime, lastTime,
            startLongitude, startLatitude, startAltitude,
            lastLongitude, lastLatitude, lastAltitude, activity, model, area) VALUES 
            ('${row.id}', '${row.pilotname}', ${row.distance},
            ${row.duration}, ${row.maxAltitude}, DATETIME('${startTime.utc().format('YYYY-MM-DD HH:mm:ss')}'), DATETIME('${endTime.utc().format('YYYY-MM-DD HH:mm:ss')}'),
            ${row.startLongitude}, ${row.startLatitude}, ${row.startAltitude},
            ${row.lastLongitude}, ${row.lastLatitude}, ${row.lastAltitude},
            '${row.activity}', '${row.model}', '${row.area}')`;
        await bigQuery.query(insertQuery);
    }
}

transferData().catch(console.error);
