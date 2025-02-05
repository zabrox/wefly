const dayjs = require('dayjs');
const { program } = require("commander");
const { MetadataLoader } = require('./metadataLoader.js');
const { deleteInvalidTracks } = require('./invalidTracksDeleter.js');

async function main() {
    program.option("-f, --from <date>", "from date (YYYY-MM-DD)")
        .option("-t, --to <date>", "to date (YYYY-MM-DD)")
        .parse(process.argv);

    const opts = program.opts();
    let to = opts.to ? dayjs(opts.to) : dayjs();
    let from = opts.from ? dayjs(opts.from) : to.subtract(3, 'day');

    const existingMetadatas = await new MetadataLoader().loadMetadatas(from, to);
    await deleteInvalidTracks(existingMetadatas);
}

main();