const { GcsUploader } = require('./gcsUploader');
const { LAKE_BUCKET_NAME } = require('./config');

function igcPath(date, track) {
    return `${date}/igcs/${track.getTrackId()}.igc`;
}

async function uploadIgc(date, track, igcLoader) {
    const igc = igcLoader.getIgcData();
    await (new GcsUploader(LAKE_BUCKET_NAME, igcPath(date, track))).upload(igc);
}

module.exports = { uploadIgc };