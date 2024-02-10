const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
const cheerio = require('cheerio');

const bucketName = 'wefly-lake';

dayjs.extend(customParseFormat)

async function parseTrackRow($, trackRow) {
    const { Track } = await import('../common/track.mjs');
    const track = new Track();

    track.pilotname = $(trackRow).find('span.liveusername a').text().match(/[a-zA-Z0-9\-]+/)[0];
    const lastLocations = $(trackRow).find('div.list_last_location');
    const lastTime = $(trackRow).find('div.list_last_time');

    track.distance = $(lastLocations[2]).text().match(/\[Max\] [\d\.]+ km/)[0].replace("[Max] ", "");

    const trackId = $(trackRow).find('td[id^=track_text_]').attr('id').replace('track_text_', '');
    track.id = trackId;

    track.activity = $(trackRow).find('img.activityImg').attr('alt');

    const timestr = lastTime.text().trim().substring(3, 22);
    track.lastTime = dayjs(timestr, 'DD-MM-YYYY HH:mm:ss');

    const status = $(trackRow).find('span.track_status').text();
    const isLive = status === 'Live!';

    return [track, isLive];
}

async function parseTracks(html) {
    const $ = cheerio.load(html);
    const tracks = [];
    $('div[id^="trackRow_"]').each(async (index, element) => {
        const [track, isLive] = await parseTrackRow($, element);
        if (isLive) {
            return;
        }
        tracks.push(track);
    });
    return tracks;
}

async function parseTrackListPage(date, pageNumber) {
    const filePath = `${date}/TrackListPage-${pageNumber}.html`;
    let content;
    try {
        const storage = new Storage();
        const file = storage.bucket(bucketName).file(filePath);
        const [exists] = await file.exists();
        if (!exists) {
            return [];
        }
        [content] = await file.download();
    } catch (error) {
        console.log(`Failed to download file: ${error.message}`);
        return [];
    }
    const html = content.toString('utf-8');

    const tracks = await parseTracks(html);
    const tracksOnFollowingPages = await parseTrackListPage(date, pageNumber + 1);
    tracks.push(...tracksOnFollowingPages);

    return tracks;
}

module.exports = { parseTrackListPage };