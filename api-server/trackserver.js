const dayjs = require('dayjs');
const zlib = require('zlib');
const util = require('util');
const { Track } = require('./common/track.js');
const { MetadataPerpetuator } = require('./metadataperpetuator.js');
const { PathPerpetuator } = require('./pathperpetuator.js');
const { SearchCondition } = require('./searchcondition.js');
const { deleteMetadata } = require('./metadataperpetuator');
const { deletePath } = require('./pathperpetuator');

const gzip = util.promisify(zlib.gzip);

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

const parseBounds = (boundsQuery) => {
    if (boundsQuery === undefined) {
        return [];
    }
    const bounds = boundsQuery.split(',').map((bound) => (parseFloat(bound)));
    if (bounds.length % 4 !== 0) {
        return [];
    }
    return [[bounds[0], bounds[1]], [bounds[2], bounds[3]]];
}
const parseActivities = (activitiesQuery) => {
    if (activitiesQuery === undefined) {
        return [];
    }
    return activitiesQuery.split(',');
}

const getMetadata = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        const searchCondition = new SearchCondition(
            dayjs(req.query.from),
            dayjs(req.query.to),
            req.query.pilotname,
            parseInt(req.query.maxAltitude),
            parseFloat(req.query.distance),
            parseInt(req.query.duration),
            parseBounds(req.query.bounds),
            parseActivities(req.query.activities),
        );
        const metadatas = await fetchMetadata(searchCondition);
        if (metadatas.length === 0) {
            res.status(404).send('No tracks found.');
            return;
        }
        const jsonString = JSON.stringify(metadatas);
        const buffer = await gzip(jsonString);
        res.header('Content-Encoding', 'gzip');
        res.header('Content-Type', 'application/json');
        res.status(200).send(buffer);
    } catch (error) {
        console.error(`Error fetching track`, error);
        res.status(500).send({ message: 'Error fetching track', error: error.message });
    }
}

const fetchPath = async (trackids) => {
    const perpetuator = new PathPerpetuator(projectId);
    return await perpetuator.fetch(trackids);
}

const getPath = async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    if (req.query.trackids === undefined) {
        res.status(400).send('Bad Request');
        return;
    }
    const trackids = req.query.trackids.split(',');
    const ret = await fetchPath(trackids);
    if (Object.keys(ret).length === 0) {
        res.status(404).send('No paths found.');
        return;
    }
    const jsonString = JSON.stringify(ret);
    const buffer = await gzip(jsonString);
    res.header('Content-Encoding', 'gzip');
    res.header('Content-Type', 'application/json');
    res.status(200).send(buffer);
}

const deleteTrack = async (req, res) => {
    const trackId = req.params.trackId;
    try {
        const metadataPerpetuator = new MetadataPerpetuator(projectId);
        await metadataPerpetuator.deleteMetadata(trackId);
        const pathPerpetuator = new PathPerpetuator(projectId);
        await pathPerpetuator.deletePath(trackId);
        res.status(200).send(`Track ${trackId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting track ${trackId}: ${error}`);
        res.status(500).send('Error deleting track.');
    }
};

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

    app.delete('/api/track/:trackId', async (req, res) => {
        deleteTrack(req, res);
    });
};

module.exports = { registerTracksEndpoint };