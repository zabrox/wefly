const dayjs = require('dayjs');
const { program } = require("commander");
const { loadTrackListPages } = require('./trackListPageLoader.js');
const { parseTrackListPage } = require('./trackListPageParser.js');
const { loadIgcs } = require('./igcLoader.js');
const { parseIgcs } = require('./igcParser.js');
const { findArea } = require('./areaFinder.js');
const { saveTracks } = require('./saveTracks.js');

async function main() {
    program.option("-d, --date <date>", "target date (YYYY-MM-DD)")
        .option("--nodownload", "skip download")
        .option("-f, --force", "force download")
        .parse(process.argv);

    const opts = program.opts();
    let date = opts.date;
    if (date === undefined) {
        date = dayjs().format('YYYY-MM-DD');
    }

    if (!opts.nodownload) {
        await loadTrackListPages(date);
    }
    let tracks = await parseTrackListPage(date, 1);
    if (tracks.length === 0) {
        console.log('No tracks found');
        return;
    }

    if (!opts.nodownload) {
        await loadIgcs(date, tracks, opts);
    }
    await parseIgcs(date, tracks);
    tracks = tracks.filter(track => track.path.points.length > 0);

    await findArea(tracks);
    await saveTracks(tracks);
}

main();