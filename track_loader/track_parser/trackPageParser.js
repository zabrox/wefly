const { Storage } = require('@google-cloud/storage');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc.js');
const customParseFormat = require('dayjs/plugin/customParseFormat.js')
const cheerio = require('cheerio');
const { TrackPageData } = require('./entity/trackPageData.js');

const bucketName = 'wefly-lake';

dayjs.extend(utc)
dayjs.extend(customParseFormat)

class TrackPageParser {
    #gcsPath;

    constructor(date, trackId) {
        this.#gcsPath = `${date}/livetrack24/TrackPage-${trackId}.html`;
    }

    async parseTrackPage() {
        const html = await this.#fetchTrackPage();
        return this.#parseHtml(html);
    }

    async #fetchTrackPage() {
        let content;
        try {
            const file = (new Storage()).bucket(bucketName).file(this.#gcsPath);
            const [exists] = await file.exists();
            if (!exists) {
                return "";
            }
            [content] = await file.download();
        } catch (error) {
            console.log(`Failed to download file: ${error.message}`);
            throw error;
        }
        const html = content.toString('utf-8');
        return html;
    }

    #parseHtml(html) {
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