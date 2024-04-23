const axios = require("axios");
const dayjs = require("dayjs");
const { Metadata } = require('./common/metadata');

const endpoint = 'https://www.wefly.tokyo/api';

async function loadMetadatas(date) {
    const metadatasurl = `${endpoint}/tracks/metadata`;
    try {
        const response = await axios({
            method: "get",
            url: metadatasurl, 
            responseType: "json",
            params: {
                from: dayjs(date).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
                to: dayjs(date).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
            }
        });
        return response.data.map(metadata => Metadata.deserialize(metadata));
    } catch (error) {
        throw error;
    }
}

module.exports = { loadMetadatas };