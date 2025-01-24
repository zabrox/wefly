const { GcsUploader } = require('./gcsUploader.js');
const { LAKE_BUCKET_NAME } = require('../config.js');

function trackPagePath(date, track) {
    return `${date}/livetrack24/TrackPage-${track.getTrackId()}.html`;
}

async function uploadTrackPage(date, track, trackPage) {
    const html = trackPage.getHtml();
    await (new GcsUploader(LAKE_BUCKET_NAME, trackPagePath(date, track))).upload(html);
}

module.exports = { uploadTrackPage };