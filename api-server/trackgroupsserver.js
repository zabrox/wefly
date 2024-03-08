const { groupTracks } = require('./trackgrouper.js');
const { MetadataPerpetuator } = require('./metadataperpetuator.js');

const projectId = 'wefly-407313'

const getTrackGroups = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const date = req.query.date;
        const perpetuator = new MetadataPerpetuator(projectId);
        const metadatas = await perpetuator.fetch(date);
        const trackGroups = groupTracks(metadatas);
        res.status(200).send(trackGroups);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching trackGroups', error: error.message });
    }
}

const registerTrackGroupsEndpoint = (app) => {
    app.get('/api/trackgroups', async (req, res) => {
        getTrackGroups(req, res);
    });
};

module.exports = { registerTrackGroupsEndpoint };