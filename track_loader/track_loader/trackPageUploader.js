const { GcsUploader } = require('./gcsUploader.js');
const { LAKE_BUCKET_NAME } = require('../config.js');
const { trackPagePath } = require('../gcsPathUtil.js')

function sourceUrlFilePath(date, track) {
    return `${date}/livetrack24/SourceUrl-${track.getTrackId()}.txt`;
}

async function uploadTrackPage(date, track, trackPage) {
    const html = trackPage.getHtml();
    await (new GcsUploader(LAKE_BUCKET_NAME, trackPagePath(date, track))).upload(html);
    await (new GcsUploader(LAKE_BUCKET_NAME, sourceUrlFilePath(date, track))).upload(track.liveTrackUrl);
}

module.exports = { uploadTrackPage };