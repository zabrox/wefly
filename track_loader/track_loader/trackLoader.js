const { TrackListPage } = require('./trackListPage.js');
const { uploadTrackListPage } = require('./trackListPageUploader.js');
const { TrackPage } = require('./trackPage.js');
const { uploadTrackPage } = require('./trackPageUploader.js');
const { IgcLoader } = require('./igcLoader.js');
const { MetadataLoader } = require('./metadataLoader.js');
const { uploadIgc } = require('./igcUploader.js');
const { loadPilotIcons } = require('./piloticonLoader.js');

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
        console.error(`Error loading track list page ${page}: ${error}`);
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

async function loadTrack(date, track, existingMetadatas, force) {
    try {
        const trackPage = new TrackPage(track.liveTrackId);
        await trackPage.load();
        track.startTime = trackPage.parseStartTime();
        track.endTime = trackPage.parseEndTime();
        track.liveTrackUrl = trackPage.liveTrackUrl;
        await uploadTrackPage(date, track, trackPage);

        if (!force && !needsUpdateTrack(track, existingMetadatas)) {
            console.log(`Track ${track.getTrackId()} is up to date`);
            return false;
        }

        const igcLoader = new IgcLoader(track.liveTrackId);
        await igcLoader.load();
        await uploadIgc(date, track, igcLoader);
    } catch (error) {
        return false;
    }
    return true
}

async function loadTracks(date, opts) {
    console.log(`Load tracks for date ${date}`);

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
    const updatedTracks = [];

    await Promise.all(trackListPages.map(async (trackListPage) => {
        await uploadTrackListPage(date, trackListPage);
        const nonLiveTracks = trackListPage.getTracks().filter((track) => !track.isLive);
        await Promise.all(nonLiveTracks.map(async (track) => {
            const updated = await loadTrack(date, track, existingMetadatas, opts.force);
            if (!updated && !opts.force) {
                return;
            }
            await loadPilotIcons(track);
            updatedTracks.push(track);
        }));
    }));
    return updatedTracks;
}

module.exports = { loadTracks };