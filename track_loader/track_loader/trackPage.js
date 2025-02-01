const axios = require('axios');
const http = require('http');
const https = require('https');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const cheerio = require('cheerio');

dayjs.extend(utc)

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const baseUrl = 'https://www.livetrack24.com';

class TrackPage {
    #liveTrackUrl;
    #liveTrackId;
    #html;

    constructor(liveTrackId) {
        this.#liveTrackId = liveTrackId;
        this.#liveTrackUrl = `${baseUrl}/track/${liveTrackId}`;
    }

    get liveTrackUrl() {
        return this.#liveTrackUrl;
    }

    async load() {
        const response = await axios.get(this.#liveTrackUrl, {
            httpAgent,
            httpsAgent,
            timeout: 10000
        });
        if (response.status !== 200) {
            throw new Error(`Failed to get ${this.#liveTrackUrl}`);
        }

        console.log(`Downloaded TrackPage: ${this.#liveTrackUrl}`);
        this.#html = response.data;
    }

    parseStartTime() {
        const $ = cheerio.load(this.#html);
        const startTimeText = $('#row2_2 div').text();
        const match = startTimeText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC.+/);
        if (!match) {
            throw new Error(`Failed to parse start time: ${this.#liveTrackUrl}`);
        }
        const datestr = match[0].replace(' UTC', '') + ':00'
        return dayjs(datestr).utc();
    }

    parseEndTime() {
        const $ = cheerio.load(this.#html);
        const startTimeText = $('#row2_3 div').text();
        const match = startTimeText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC.+/);
        if (!match) {
            throw new Error(`Failed to parse start time: ${this.#liveTrackUrl}`);
        }
        const datestr = match[0].replace(' UTC', '') + ':00'
        return dayjs(datestr).utc();
    }

    getHtml() {
        return this.#html;
    }

    getLiveTrackId() {
        return this.#liveTrackId;
    }
}

module.exports = { TrackPage };