const { GcsUploader } = require('./gcsUploader.js');
const { LAKE_BUCKET_NAME } = require('../config.js');
const { trackListPagePath } = require('../gcsPathUtil.js')

async function uploadTrackListPage(date, trackListPage) {
    const pageNumber = trackListPage.getPageNumber();
    const html = trackListPage.getHtml();
    await (new GcsUploader(LAKE_BUCKET_NAME, trackListPagePath(date, pageNumber))).upload(html);
}

module.exports = { uploadTrackListPage };