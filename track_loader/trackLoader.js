const { TrackListPage } = require('./trackListPage.js');
const { uploadTrackListPage } = require('./trackListPageUploader.js');
const { TrackPage } = require('./trackPage.js');
const { uploadTrackPage } = require('./trackPageUploader.js');
const { IgcLoader } = require('./igcLoader.js');
const { uploadIgc } = require('./igcUploader.js');

const MAX_ROWS_PER_PAGE = 10;

async function loadTrackListPages(date, page, trackListPages) {
    try {
        const trackListPage = new TrackListPage(date, page);
        await trackListPage.load();
        const rows = trackListPage.getTracks().length;
        if (rows === 0) {
            return trackListPages;
        }
        trackListPages.push(trackListPage);
        if (rows < MAX_ROWS_PER_PAGE) {
            return trackListPages;
        }
        trackListPages = await loadTrackListPages(date, page + 1, trackListPages);
        return trackListPages;
    } catch (error) {
        console.log(`Error loading track list page ${page}: ${error}`);
        throw error;
    }
}

async function loadTracks(date) {
    let trackListPages;
    try {
        trackListPages = await loadTrackListPages(date, 1, []);
    } catch (error) {
        return;
    }
    if (trackListPages.length === 0) {
        console.log('No tracks found');
        return;
    }

    await Promise.all(trackListPages.map(async (trackListPage) => {
        await uploadTrackListPage(date, trackListPage);
        const nonLiveTracks = trackListPage.getTracks().filter((track) => !track.isLive);
        await Promise.all(nonLiveTracks.map(async (track) => {
                const trackPage = new TrackPage(track.liveTrackId);
                await trackPage.load();
                await uploadTrackPage(date, track, trackPage);

                const igcLoader = new IgcLoader(track.liveTrackId);
                await igcLoader.load();
                await uploadIgc(date, track, igcLoader);
            }));
    }));
}

module.exports = { loadTracks };