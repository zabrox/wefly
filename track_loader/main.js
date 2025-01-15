const dayjs = require('dayjs');
const { program } = require("commander");
const { loadTracks } = require('./trackLoader.js');

async function main() {
    program.option("-d, --date <date>", "target date (YYYY-MM-DD)")
        .parse(process.argv);

    const opts = program.opts();
    let date = opts.date;
    if (date === undefined) {
        date = dayjs().format('YYYY-MM-DD');
    }
    loadTracks(date);
}

main();