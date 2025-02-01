const { GcsUploader } = require('./gcsUploader');
const { LAKE_BUCKET_NAME } = require('../config');
const { igcPath } = require('../gcsPathUtil');

async function uploadIgc(date, track, igcLoader) {
    const igc = igcLoader.getIgcData();
    await (new GcsUploader(LAKE_BUCKET_NAME, igcPath(date, track))).upload(igc);
}

module.exports = { uploadIgc };