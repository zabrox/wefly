const { GcsUploader } = require('./gcsUploader.js');
const { LAKE_BUCKET_NAME } = require('../config.js');

function trackListPagePath(date, pageNumber) {
    return `${date}/livetrack24/TrackListPage-${pageNumber}.html`;
}

async function uploadTrackListPage(date, trackListPage) {
    const pageNumber = trackListPage.getPageNumber();
    const html = trackListPage.getHtml();
    await (new GcsUploader(LAKE_BUCKET_NAME, trackListPagePath(date, pageNumber))).upload(html);
}

module.exports = { uploadTrackListPage };