const dayjs = require('dayjs');
const { Track } = require('./common/track.js');
const { MetadataPerpetuator } = require('./metadataperpetuator.js');
const { PathPerpetuator } = require('./pathperpetuator.js');
const { SearchCondition } = require('./searchcondition.js');

const projectId = 'wefly-407313'

const postMetadata = async (track) => {
    const perpetuator = new MetadataPerpetuator(projectId);
    await perpetuator.perpetuate(track);
}

const postPath = (track) => {
    const perpetuator = new PathPerpetuator(projectId);
    perpetuator.perpetuate(track);
};

const postTracks = async (req, res) => {
    const track = Track.deserialize(req.body);
    try {
        postPath(track);
        await postMetadata(track);
        res.status(200).send(`Path data for ${track.getId()} saved successfully.`);
    } catch (error) {
        console.error(`Error writing ${track.getId()}: ${error}`);
        res.status(500).send('Error writing path data.');
    }
}

const fetchMetadata = async (searchCondition) => {
    const perpetuator = new MetadataPerpetuator(projectId);
    return await perpetuator.fetch(searchCondition);
}

const getMetadata = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const searchCondition = new SearchCondition(
            dayjs(req.query.from),
            dayjs(req.query.to),
            req.query.pilotname,
            parseInt(req.query.maxAltitude),
            parseFloat(req.query.distance),
            parseInt(req.query.duration),
        );
        const metadatas = await fetchMetadata(searchCondition);
        if (metadatas.length === 0) {
            res.status(404).send('No tracks found.');
            return;
        }
        res.status(200).send(metadatas);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching track', error: error.message });
    }
}

const fetchPath = async (trackids) => {
    const perpetuator = new PathPerpetuator(projectId);
    return await perpetuator.fetch(trackids);
}

const getPath = async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.query.trackids === undefined) {
        res.status(400).send('Bad Request');
        return;
    }
    const trackids = req.query.trackids.split(',');
    try {
        const ret = await fetchPath(trackids);
        res.status(200).send(ret);
    } catch (error) {
        res.status(500).send({ message: `Error fetching paths for ${trackids}`, error: error.message });
    }
}
const registerTracksEndpoint = (app) => {
    app.post('/api/tracks', async (req, res) => {
        postTracks(req, res);
    });

    app.get('/api/tracks/metadata', async (req, res) => {
        getMetadata(req, res);
    });

    app.get('/api/tracks/paths', async (req, res) => {
        getPath(req, res);
    });
};

module.exports = { registerTracksEndpoint };