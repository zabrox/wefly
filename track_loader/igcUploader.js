const { GcsUploader } = require('./gcsUploader');
const { LAKE_BUCKET_NAME } = require('./config');

function igcPath(date, track) {
    const pilotname = track.pilotname;
    const liveTrackId = track.liveTrackId;
    return `${date}/igcs/${pilotname}_${liveTrackId}.igc`;
}

async function uploadIgc(date, track, igcLoader) {
    const igc = igcLoader.getIgcData();
    await (new GcsUploader(LAKE_BUCKET_NAME, igcPath(date, track))).upload(igc);
}

module.exports = { uploadIgc };