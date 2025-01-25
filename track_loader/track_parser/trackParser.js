const { IGCParser } = require('./igcParser');
const { TrackPageParser } = require('./trackPageParser');
const { Track } = require('./entity/track');
const { uploadTrack } = require('./trackUploader');
const { AreaFinder } = require('./areaFinder');

function createTrack(trackPageData, path, area) {
    const track = new Track();
    track.path = path;
    track.metadata.pilotname = trackPageData.pilotname;
    track.metadata.distance = trackPageData.distance;
    track.metadata.duration = track.path.duration();
    track.metadata.maxAltitude = track.path.maxAltitude();
    track.metadata.startTime = track.path.startTime();
    track.metadata.lastTime = track.path.endTime();
    track.metadata.startPosition = track.path.points[0];
    track.metadata.lastPosition = track.path.points.slice(-1)[0];
    track.metadata.activity = trackPageData.activity;
    track.metadata.model = trackPageData.model;
    track.metadata.area = area.areaName;
    return track;
}

async function parseTracks(date, trackIds) {
    console.log(`Parse tracks for date ${date}`);

    Promise.all(trackIds.map(async trackId => {
        const trackPageParser = new TrackPageParser(date, trackId);
        const trackPageData = await trackPageParser.parseTrackPage();

        const igcParser = new IGCParser(date, trackId);
        const path = await igcParser.parseIGC();
        console.log(`Parsed path for file ${trackId}:`);

        const area = await new AreaFinder().findArea(path.points[0]);
        const track = createTrack(trackPageData, path, area);

        await uploadTrack(track);
    }));
}

module.exports = { parseTracks };