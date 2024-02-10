const dayjs = require('dayjs');
const { loadTrackListPages } = require('./trackListPageLoader.js');
const { parseTrackListPage } = require('./trackListPageParser.js');
const { loadIgcs } = require('./igcLoader.js');
const { parseIgcs } = require('./igcParser.js');
const { groupTracks } = require('./trackGrouper.js');
const { findArea } = require('./areaFinder.js');
const { saveTracks } = require('./saveTracks.js');

async function main() {
    let date = process.argv[2];
    if (date === undefined) {
        date = dayjs().format('YYYY-MM-DD');
    }
    // await loadTrackListPages(date);
    const tracks = await parseTrackListPage(date, 1);
    if (tracks.length === 0) {
        console.log('No tracks found');
        return;
    }

    // await loadIgcs(date, tracks);
    await parseIgcs(date, tracks);
    const groups = await groupTracks(tracks);
    await findArea(tracks);

    saveTracks(date, tracks);
}

main();