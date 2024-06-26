const dayjs = require('dayjs');
const { Firestore } = require('@google-cloud/firestore');
const { program } = require("commander");
const { loadTrackListPages } = require('./trackListPageLoader.js');
const { parseTrackListPage } = require('./trackListPageParser.js');
const { filterExistingTracks } = require('./existingTrackFilter.js');
const { loadMetadatas } = require('./metadataLoader.js');
const { loadTrackPages } = require('./trackPageLoader.js');
const { parseTrackPages } = require('./trackPageParser.js');
const { loadIgcs } = require('./igcLoader.js');
const { saveTracks } = require('./saveTracks.js');
const { loadPilotIcons } = require('./piloticonLoader.js');

async function loadTracks(date, opts) {

    if (!opts.nodownload) {
        await loadTrackListPages(date);
    }

    let tracks = await parseTrackListPage(date, 1);
    if (tracks.length === 0) {
        console.log('No tracks found');
        return;
    }

    if (!opts.nodownload) {
        await loadTrackPages(date, tracks, opts);
    }
    await parseTrackPages(date, tracks);

    if (!opts.force) {
        const existingMetadatas = await loadMetadatas(date);
        tracks = filterExistingTracks(tracks, existingMetadatas);
    }

    if (!opts.nodownload) {
        await loadIgcs(date, tracks, opts);
    }
    await loadPilotIcons(tracks);
    await saveTracks(date, tracks);
}

async function main() {
    program.option("-d, --date <date>", "target date (YYYY-MM-DD)")
        .option("--nodownload", "skip download")
        .option("-f, --force", "force download")
        .option("-s, --start <start>", "start date (YYYY-MM-DD)")
        .option("-e, --end <end>", "end date (YYYY-MM-DD)")
        .option("-i, --interval <interval>", "interval (second)")
        .parse(process.argv);

    const opts = program.opts();
    if (opts.start !== undefined && opts.end !== undefined) {
        const start = dayjs(opts.start);
        const end = dayjs(opts.end);
        const firestore = new Firestore();
        const docRef = firestore.collection('track_loader').doc('lastLoaded');
        const doc = await docRef.get();
        let date = start;
        if (doc.exists) {
            date = dayjs(doc.data().date).add(1, 'day');
        }
        if (date.isAfter(end)) {
            console.log('Target date is after end date');
            return;
        }
        await loadTracks(date.format('YYYY-MM-DD'), opts);
        await docRef.set({ date: date.format('YYYY-MM-DD') });
        return;
    }
    let date = opts.date;
    if (date === undefined) {
        date = dayjs().format('YYYY-MM-DD');
    }
    loadTracks(date, opts);
}

main();