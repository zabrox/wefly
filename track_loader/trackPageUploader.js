const { GcsUploader } = require('./gcsUploader.js');
const { LAKE_BUCKET_NAME } = require('./config');

function trackPagePath(date, track) {
    const pilotname = track.pilotname;
    const liveTrackId = track.liveTrackId;
    return `${date}/livetrack24/TrackPage-${pilotname}_${liveTrackId}.html`;
}

async function uploadTrackPage(date, track, trackPage) {
    const html = trackPage.getHtml();
    await (new GcsUploader(LAKE_BUCKET_NAME, trackPagePath(date, track))).upload(html);
}

module.exports = { uploadTrackPage };