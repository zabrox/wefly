const { BigQuery } = require('@google-cloud/bigquery');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Metadata } = require('./common/metadata.js');
const { activityQuery } = require('./activityquery');

dayjs.extend(utc);

const datasetId = 'wefly';
const tableId = 'metadatas';

const bigQuery = new BigQuery();
const QUERY_LIMIT = 1000;

class MetadataPerpetuator {
    async perpetuate(track) {
        const source = `SELECT
            ${track.metadata.distance} AS distance,
            ${track.metadata.duration} AS duration,
            ${track.metadata.maxAltitude} AS maxAltitude, 
            ${track.metadata.maxGain} AS maxGain, 
            DATETIME('${track.metadata.lastTime.format('YYYY-MM-DD HH:mm:ss')}') AS lastTime,
            ${track.metadata.lastPosition[0]} AS lastLongitude, ${track.metadata.lastPosition[1]} AS lastLatitude, ${track.metadata.lastPosition[2]} AS lastAltitude`;
        const updateQuery = `UPDATE SET 
            distance = s.distance,
            duration = s.duration,
            maxAltitude = s.maxAltitude, 
            maxGain = s.maxGain,
            lastTime = s.lastTime,
            lastLongitude = s.lastLongitude, lastLatitude = s.lastLatitude, lastAltitude = s.lastAltitude`;
        const insertQuery = `INSERT (
            id, pilotname, distance, duration, maxAltitude, maxGain, startTime, lastTime,
            startLongitude, startLatitude, startAltitude,
            lastLongitude, lastLatitude, lastAltitude, activity, model, area, dataSource) VALUES 
            ('${track.getId()}', '${track.metadata.pilotname}', ${track.metadata.distance},
            ${track.metadata.duration}, ${track.metadata.maxAltitude}, ${track.metadata.maxGain},
            DATETIME('${track.metadata.startTime.utc().format('YYYY-MM-DD HH:mm:ss')}'), DATETIME('${track.metadata.lastTime.utc().format('YYYY-MM-DD HH:mm:ss')}'),
            ${track.metadata.startPosition[0]}, ${track.metadata.startPosition[1]}, ${track.metadata.startPosition[2]},
            ${track.metadata.lastPosition[0]}, ${track.metadata.lastPosition[1]}, ${track.metadata.lastPosition[2]},
            '${track.metadata.activity}', '${track.metadata.model}', '${track.metadata.area}', '${track.metadata.dataSource}')`;
        const query = `MERGE INTO ${datasetId}.${tableId} AS t
            USING (${source}) AS s
            ON t.id = '${track.getId()}'
            WHEN MATCHED THEN ${updateQuery}
            WHEN NOT MATCHED THEN ${insertQuery}`;
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
        if (searchCondition.bounds.length > 0) {
            const bounds = searchCondition.bounds;
            query += ` AND startLongitude >= ${bounds[0][0]} AND startLongitude <= ${bounds[1][0]}`;
            query += ` AND startLatitude >= ${bounds[0][1]} AND startLatitude <= ${bounds[1][1]}`;
        }
        if (searchCondition.activities.length > 0) {
            query += activityQuery(searchCondition.activities);
        }

        query += ` LIMIT ${QUERY_LIMIT}`;
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
        metadata.maxGain = row.maxGain;
        metadata.startTime = dayjs.utc(row.startTime.value);
        metadata.lastTime = dayjs.utc(row.lastTime.value);
        metadata.startPosition = [row.startLongitude, row.startLatitude, row.startAltitude];
        metadata.lastPosition = [row.lastLongitude, row.lastLatitude, row.lastAltitude]
        metadata.activity = row.activity;
        metadata.model = row.model;
        metadata.area = row.area;
        metadata.dataSource = row.dataSource;
        return metadata;
    }
}

module.exports = { MetadataPerpetuator };