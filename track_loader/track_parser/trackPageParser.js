const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc.js');
const customParseFormat = require('dayjs/plugin/customParseFormat.js')
const cheerio = require('cheerio');
const { TrackPageData } = require('./entity/trackPageData.js');
const { trackPagePath } = require('../gcsPathUtil.js')

const bucketName = 'wefly-lake';

dayjs.extend(utc)
dayjs.extend(customParseFormat)

class TrackPageParser {
    #date;
    #livetrackTrack;

    constructor(date, livetrackTrack) {
        this.#date = date;
        this.#livetrackTrack = livetrackTrack;
    }

    async parseTrackPage() {
        const html = await this.#fetchTrackPage();
        return this.#parseHtml(html);
    }

    async #fetchGcsFile(bucketName, filePath) {
        const storage = new Storage();
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filePath);
        const [exists] = await file.exists();
        if (!exists) {
            throw new Error(`File not found: ${filePath}`);
        }
        const [content] = await file.download();
        return content.toString('utf-8');
    }

    async #fetchTrackPage() {
        try {
            const content = await this.#fetchGcsFile(bucketName, trackPagePath(this.#date, this.#livetrackTrack));
            const html = content.toString('utf-8');
            return html;
        } catch (error) {
            console.log(`Failed to download file: ${error.message}`);
            return "";
        }
    }

    #parseHtml(html) {
        if (html === "") {
            return undefined;
        }
        const $ = cheerio.load(html);
        const trackPageData = new TrackPageData();
        const { model, activity } = this.#parseModelAndActivity($);
        trackPageData.model = model;
        trackPageData.activity = activity;
        trackPageData.pilotname = this.#parsePilotname($);
        trackPageData.distance = this.#parseDistance($);
        return trackPageData;
    }

    #parseModelAndActivity($) {
        let model = $('#row2_1 h3').text().trim();
        const activity = $('#row2_1 img').attr('alt');
        if (model === 'My vehicle' || model === activity) {
            model = "";
        }
        return { model, activity };
    }

    #parsePilotname($) {
        return $('.pageheader a').text().split(" - ")[0].split('\n')[0];
    }

    #parseDistance($) {
        const distance = $('#averagePace span').text();
        return parseFloat(distance);
    }
}

module.exports = { TrackPageParser };