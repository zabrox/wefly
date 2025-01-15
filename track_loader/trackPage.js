const axios = require('axios');
const http = require('http');
const https = require('https');

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

    getHtml() {
        return this.#html;
    }

    getLiveTrackId() {
        return this.#liveTrackId;
    }
}

module.exports = { TrackPage };