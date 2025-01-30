const { IGCParser } = require('./igcParser');
const { TrackPageParser } = require('./trackPageParser');
const { Track } = require('./entity/track');
const { uploadTrack } = require('./trackUploader');
const { AreaFinder } = require('./areaFinder');

function createTrack(trackPageData, path, area, livetrackTrack) {
    const track = new Track();
    track.path = path;
    track.metadata.pilotname = trackPageData.pilotname;
    track.metadata.distance = trackPageData.distance;
    track.metadata.duration = track.path.duration();
    track.metadata.maxAltitude = track.path.maxAltitude();
    track.metadata.maxGain = track.path.maxGain();
    track.metadata.startTime = track.path.startTime();
    track.metadata.lastTime = track.path.endTime();
    track.metadata.startPosition = track.path.points[0];
    track.metadata.lastPosition = track.path.points.slice(-1)[0];
    track.metadata.activity = trackPageData.activity;
    track.metadata.model = trackPageData.model;
    track.metadata.area = area.areaName;
    track.metadata.dataSource = livetrackTrack.liveTrackUrl;
    return track;
}

async function parseTracks(date, livetrackTracks) {
    console.log(`Parse tracks for date ${date}`);

    Promise.all(livetrackTracks.map(async livetrackTrack => {
        const trackPageParser = new TrackPageParser(date, livetrackTrack);
        let trackPageData;
        try {
            trackPageData = await trackPageParser.parseTrackPage();
        } catch (error) {
            console.log(`Failed to parse track page: ${error.message}`);
            return;
        }
        if (trackPageData === undefined) {
            return;
        }

        const igcParser = new IGCParser(date, livetrackTrack);
        const path = await igcParser.parseIGC();
        console.log(`Parsed path for file ${livetrackTrack.getTrackId()}:`);

        const area = await new AreaFinder().findArea(path.points[0]);
        const track = createTrack(trackPageData, path, area, livetrackTrack);

        await uploadTrack(track);
    }));
}

module.exports = { parseTracks };