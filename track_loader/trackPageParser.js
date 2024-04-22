const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const cheerio = require('cheerio');

const bucketName = 'wefly-lake';

dayjs.extend(utc)
dayjs.extend(customParseFormat)

function gcsFilePath(track, date) {
    return `${date}/livetrack24/TrackPage-${track.metadata.liveTrackId}.html`;
}

function parseHtml(html, track) {
    const $ = cheerio.load(html);
    const model = $('#row2_1 h3').text().trim();
    const activity = $('#row2_1 img').attr('alt');
    if (model != 'My vehicle' && model != activity) {
        track.metadata.model = model;
    }

    const startTime = $('#row2_2 div').text().match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[0];
    track.metadata.startTime = dayjs(startTime, 'YYYY-MM-DD HH:mm:ss').utc()
}

async function parseTrackPage(date, track) {
    const filePath = gcsFilePath(track, date);
    let content;
    try {
        const storage = new Storage();
        const file = storage.bucket(bucketName).file(filePath);
        const [exists] = await file.exists();
        if (!exists) {
            return;
        }
        [content] = await file.download();
    } catch (error) {
        console.log(`Failed to download file: ${error.message}`);
        return;
    }
    const html = content.toString('utf-8');
    parseHtml(html, track);
    console.log(`Processed track page for ${track.getId()} done`);
}

async function parseTrackPages(date, tracks) {
    for (const track of tracks) {
        await parseTrackPage(date, track);
    }
}

module.exports = { parseTrackPages };