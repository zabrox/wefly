const { BigQuery } = require('@google-cloud/bigquery');
const dayjs = require('dayjs');
const { Metadata } = require('./common/metadata.js');

const datasetId = 'wefly';
const tableId = 'metadata';

const bigQuery = new BigQuery();

class MetadataPerpetuator {
    async perpetuate(track) {
        const query = `INSERT INTO \`${datasetId}.${tableId}\` (
            id, pilotname, distance, duration, maxAltitude, startTime, lastTime,
            startLongitude, startLatitude, startAltitude,
            lastLongitude, lastLatitude, lastAltitude, activity, model, area) VALUES 
            ('${track.getId()}', '${track.metadata.pilotname}', ${track.metadata.distance},
            ${track.metadata.duration}, ${track.metadata.maxAltitude}, DATETIME('${track.metadata.startTime.format('YYYY-MM-DD HH:mm:ss')}'), DATETIME('${track.metadata.lastTime.format('YYYY-MM-DD HH:mm:ss')}'),
            ${track.metadata.startPosition[0]}, ${track.metadata.startPosition[1]}, ${track.metadata.startPosition[2]},
            ${track.metadata.lastPosition[0]}, ${track.metadata.lastPosition[1]}, ${track.metadata.lastPosition[2]},
            '${track.metadata.activity}', '${track.metadata.model}', '${track.metadata.area}')`;
        await bigQuery.query(query);
    }

    async fetch(searchCondition) {
        const start = searchCondition.fromDate.format('YYYY-MM-DD HH:mm:ss');
        const end = searchCondition.toDate.format('YYYY-MM-DD HH:mm:ss');
        let query = `SELECT * FROM \`${datasetId}.${tableId}\` WHERE
            startTime >= '${start}' AND startTime <= '${end}'`;
        if (searchCondition.pilotname) {
            query += ` AND pilotname = '${searchCondition.pilotname}'`;
        }
        if (searchCondition.maxAltitude) {
            query += ` AND maxAltitude >= ${searchCondition.maxAltitude}`;
        }
        if (searchCondition.distance) {
            query += ` AND distance >= ${searchCondition.distance}`;
        }
        if (searchCondition.duration) {
            query += ` AND duration >= ${searchCondition.duration}`;
        }
        const [job] = await bigQuery.createQueryJob({ query: query });
        const [rows] = await job.getQueryResults();
        if (rows.empty) {
            return [];
        }
        const metadatas = rows.map(row => {
            return this.#convertFromBigQueryRow(row);
        });
        return metadatas;
    }

    #convertFromBigQueryRow(row) {
        const metadata = new Metadata();
        metadata.pilotname = row.pilotname;
        metadata.distance = row.distance;
        metadata.duration = row.duration;
        metadata.maxAltitude = row.maxAltitude;
        metadata.startTime = dayjs(row.startTime.value);
        metadata.lastTime = dayjs(row.lastTime.value);
        metadata.startPosition = [row.startLongitude, row.startLatitude, row.startAltitude];
        metadata.lastPosition = [row.lastLongitude, row.lastLatitude, row.lastAltitude]
        metadata.activity = row.activity;
        metadata.model = row.model;
        metadata.area = row.area;
        return metadata;
    }
}

module.exports = { MetadataPerpetuator };