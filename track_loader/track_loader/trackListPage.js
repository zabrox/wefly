const axios = require('axios');
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');
const { Track } = require('./entity/track');

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

const baseUrl = 'https://www.livetrack24.com';

class TrackListPage {
    #liveTrackUrl;
    #pageNumber;
    #html;

    constructor(date, pageNumber) {
        this.#liveTrackUrl = `${baseUrl}/tracks/country/jp/from/${date}/to/${date}/page_num/${pageNumber}/`;
        this.#pageNumber = pageNumber;
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

        console.log(`Downloaded TrackListPage: ${this.#liveTrackUrl}`);
        this.#html = response.data;
    }

    getPageNumber() {
        return this.#pageNumber;
    }

    getHtml() {
        return this.#html;
    }

    getTracks() {
        const $ = cheerio.load(this.#html);
        const tracks = [];

        $('div[id^="trackRow_"]').each(async (_, trackRow) => {
            const pilotname = $(trackRow).find('span.liveusername a').text().match(/[a-zA-Z0-9\-]+/)[0];
            const trackId = $(trackRow).attr('data-trackid');
            const status = $(trackRow).find('span.track_status').text();
            const isLive = status === 'Live!';
            tracks.push(new Track(pilotname, trackId, isLive));
        });
        return tracks;
    }
}

module.exports = { TrackListPage };