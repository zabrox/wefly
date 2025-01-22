const { TrackListPage } = require('./trackListPage.js');
const { uploadTrackListPage } = require('./trackListPageUploader.js');
const { TrackPage } = require('./trackPage.js');
const { uploadTrackPage } = require('./trackPageUploader.js');
const { IgcLoader } = require('./igcLoader.js');
const { MetadataLoader } = require('./metadataLoader.js');
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

function needsUpdateTrack(track, existingMetadatas) {
    const metadata = existingMetadatas.find(metadata => metadata.getId() === track.getTrackId());
    if (!metadata) {
        return true;
    }
    if (metadata.lastTime.isBefore(track.endTime)) {
        return true;
    }
    return false;
}

async function loadTrack(date, track, existingMetadatas) {
    const trackPage = new TrackPage(track.liveTrackId);
    await trackPage.load();
    track.startTime = trackPage.parseStartTime();
    track.endTime = trackPage.parseEndTime();
    await uploadTrackPage(date, track, trackPage);

    if (!needsUpdateTrack(track, existingMetadatas)) {
        console.log(`Track ${track.getTrackId()} is up to date`);
        return;
    }

    const igcLoader = new IgcLoader(track.liveTrackId);
    await igcLoader.load();
    await uploadIgc(date, track, igcLoader);
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

    const existingMetadatas = await new MetadataLoader().loadMetadatas(date);

    await Promise.all(trackListPages.map(async (trackListPage) => {
        await uploadTrackListPage(date, trackListPage);
        const nonLiveTracks = trackListPage.getTracks().filter((track) => !track.isLive);
        await Promise.all(nonLiveTracks.map(async (track) => {
            await loadTrack(date, track, existingMetadatas);
        }));
    }));
}

module.exports = { loadTracks };