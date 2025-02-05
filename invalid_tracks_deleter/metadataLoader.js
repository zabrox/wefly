const axios = require("axios");
const dayjs = require("dayjs");
const { API_URL } = require('./config');
const { Metadata } = require('./entity/metadata');

class MetadataLoader {
    async loadMetadatas(from, to) {
        const metadatasurl = `${API_URL}/tracks/metadata`;
        try {
            const response = await axios({
                method: "get",
                url: metadatasurl,
                responseType: "json",
                params: {
                    from: from.startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
                    to: to.endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
                }
            });
            return response.data.map(metadata => Metadata.deserialize(metadata));
        } catch (error) {
            return [];
        }
    }
}

module.exports = { MetadataLoader };