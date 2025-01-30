const dayjs = require('dayjs');
const { program } = require("commander");
const { loadTracks } = require('./track_loader/trackLoader.js');
const { parseTracks } = require('./track_parser/trackParser.js');

async function main() {
    program.option("-d, --date <date>", "target date (YYYY-MM-DD)")
        .option("-f, --force", "Download and parse all tracks")
        .parse(process.argv);

    const opts = program.opts();
    let date = opts.date;
    if (date === undefined) {
        date = dayjs().format('YYYY-MM-DD');
    }
    const updatedLivetrackTracks = await loadTracks(date, opts);
    await parseTracks(date, updatedLivetrackTracks);
}

main();