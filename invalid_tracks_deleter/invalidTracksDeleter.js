const axios = require('axios');
const http = require('http');
const https = require('https');
const { API_URL } = require('./config');

// force IPv4
const httpAgent = new http.Agent({ family: 4 });
const httpsAgent = new https.Agent({ family: 4 });

async function deleteTrack(trackId) {
    try {
        await axios.delete(`${API_URL}/track/${trackId}`);
        console.log(`Deleted track ${trackId}`);
    } catch (error) {
        console.error(`Failed to delete track ${trackId}: ${error.message}`);
    }
}

async function deleteInvalidTracks(existingMetadatas) {
    for (const metadata of existingMetadatas) {
        if (metadata.dataSource) {
            try {
                const response = await axios.head(metadata.dataSource, {
                    httpAgent,
                    httpsAgent,
                    timeout: 10000,
                });
                if (response.request.path === '/page/error') {
                    await deleteTrack(metadata.getId());
                } else if (response.status === 200) {
                    console.log(`${metadata.dataSource} exists`);
                } else {
                    console.error(`Error checking dataSource for ${metadata.dataSource}`);
                }
            } catch (error) {
                console.error(`Error checking dataSource for ${metadata.dataSource}:`, error.message);
            }
        }
    }
}

module.exports = { deleteInvalidTracks };