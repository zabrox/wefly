
function trackListPagePath(date, pageNumber) {
    return `${date}/livetrack24/TrackListPage-${pageNumber}.html`;
}

function trackPagePath(date, track) {
    return `${date}/livetrack24/TrackPage-${track.getTrackId()}.html`;
}

function sourceUrlFilePath(date, track) {
    return `${date}/livetrack24/SourceUrl-${track.getTrackId()}.txt`;
}

function igcPath(date, track) {
    return `${date}/igcs/${track.getTrackId()}.igc`;
}

module.exports = { trackListPagePath, trackPagePath, sourceUrlFilePath, igcPath };