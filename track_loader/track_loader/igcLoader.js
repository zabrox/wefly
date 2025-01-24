const axios = require('axios');
const http = require('http');
const https = require('https');

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });


class IgcLoader {
    #igcUrl;
    #igcData;

    constructor(liveTrackId) {
        this.#igcUrl = `https://www.livetrack24.com/leo_live.php?op=igc&trackID=${liveTrackId}`;
    }

    async load() {
        const response = await axios.get(this.#igcUrl, {
            responseType: 'arraybuffer',
            httpAgent,
            httpsAgent,
            timeout: 10000,
        });
        if (response.status !== 200) {
            throw new Error(`Failed to get ${this.#igcUrl}`);
        }

        console.log(`Downloaded IGC data: ${this.#igcUrl}`);
        this.#igcData = response.data;
    }

    getIgcData() {
        return this.#igcData;
    }
}

module.exports = { IgcLoader };