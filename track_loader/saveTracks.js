const { Storage } = require('@google-cloud/storage');
const { Cartographic, Math } = require('cesium');
const zlib = require('zlib');
const util = require('util');

const gzip = util.promisify(zlib.gzip);
const storage = new Storage();

const bucketName = 'wefly';

async function aggregateTracks(date, aggregatedJson) {
    const bucket = storage.bucket(bucketName);
    const fileName = `${date}/tracks/japan.json.gz`;
    const file = bucket.file(fileName);

    const compressed = await gzip(JSON.stringify(aggregatedJson));
    await file.save(compressed);
    console.log(`Aggregated track data saved to ${fileName}`);
}

async function saveTracks(date, tracks) {
    const bucket = storage.bucket(bucketName);
    const aggregatedJson = [];

    for (const track of tracks) {
        const dateTimeStr = track.lastTime.format('YYYYMMDDHHmmss');
        const fileName = `${date}/tracks/${track.pilotname}_${dateTimeStr}.json`;
        const file = bucket.file(fileName);

        const trackJson = {
            track_points: track.path.points.map((point, index) => {
                const cartographic = Cartographic.fromCartesian(point);
                return [
                    track.path.times[index].format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
                    (cartographic.latitude * 180 / Math.PI).toFixed(6),
                    (cartographic.longitude * 180 / Math.PI).toFixed(6),
                    parseInt(cartographic.height),
                ];
            }),
            pilotname: track.pilotname,
            distance: track.distance,
            duration: track.path.durationStr(),
            activity: track.activity,
        };
        if (track.area) {
            trackJson.area = track.area.areaName;
        }

        const json = JSON.stringify(trackJson);
        await file.save(json, {
            contentType: 'application/json',
        });
        aggregatedJson.push(trackJson);

        console.log(`Track data saved to ${fileName}`);
    }
    await aggregateTracks(date, aggregatedJson);
}

module.exports = { saveTracks };
