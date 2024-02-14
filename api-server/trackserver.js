const dayjs = require('dayjs');
const Firestore = require('@google-cloud/firestore');
const { Track } = require('../common/track.js');
const { Metadata } = require('../common/metadata.js');
const { Client } = require('pg');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const collection = "metadatas";

const PG_HOST = '34.146.14.77';
const PG_USER = 'postgres';
const PG_PASSWORD = 'Meltingp0t';
const PG_DB = 'wefly';

const convertToFirestoreObject = (metadata) => {
    const metadataCopy = JSON.parse(JSON.stringify(metadata));
    metadataCopy.lastTime = Firestore.Timestamp.fromDate(metadata.lastTime.toDate());
    metadataCopy.startTime = Firestore.Timestamp.fromDate(metadata.startTime.toDate());
    return metadataCopy;
};

const postMetadata = async (track) => {
    const metadata = convertToFirestoreObject(track.metadata);
    await db.collection(collection).doc(track.getId()).set(metadata);
    console.log(`Write metadata for ${track.getId()} successful`);
};

const getPgClient = () => {
    return new Client({
        host: PG_HOST,
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DB,
        port: 5432,
    });
};

const postPath = async (track) => {
    const client = getPgClient();
    client.connect();

    // delete existing path data
    const deleteQuery = `DELETE FROM path WHERE trackid='${track.getId()}';`;
    try {
        await client.query(deleteQuery);
    } catch (error) {
        throw error;
    };

    const basequery = 'INSERT INTO path (trackid, longitude, latitude, altitude, time) VALUES ';
    const values = track.path.points.map((point, index) => {
        return `(
            '${track.getId()}',
            ${point[0]},
            ${point[1]},
            ${point[2]},
            '${track.path.times[index].toISOString()}'
        )`;
    }).join(',');

    const query = basequery + values + ';';

    try {
        await client.query(query);
    } catch (error) {
        throw error;
    };
    console.log(`Insert path for ${track.getId()} successful`);
    client.end();
};

const registerTracksEndpoint = (app) => {
    app.post('/api/tracks', async (req, res) => {
        const track = Track.deserialize(req.body);
        try {
            await postPath(track);
            await postMetadata(track);
            res.status(200).send(`Path data for ${track.getId()} saved successfully.`);
        } catch (error) {
            console.error(`Error writing ${track.getId()}: ${error}`);
            res.status(500).send('Error writing path data.');
        }
    });

    app.get('/api/tracks/metadata', async (req, res) => {
        try {
            const trackId = req.query.trackid;
            const doc = await db.collection('tracks').doc(trackId).get();
            if (!doc.exists) {
                return res.status(404).send({ message: 'Track not found' });
            }
            const metadataData = doc.data();
            const metadata = Metadata.deserialize(metadataData);
            res.status(200).send(metadata);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching track', error: error.message });
        }
    });

    app.get('/api/tracks/path', async (req, res) => {
        const trackid = req.query.trackid;
        if (trackid === undefined) {
            res.status(400).send('Bad Request');
            return;
        }
        try {
            const client = getPgClient();
            client.connect();
            const query = `SELECT * FROM path WHERE trackid='${trackid}';`;
            const result = await client.query(query);
            const ret = result.rows.map(row => {
                return [row.longitude, row.latitude, row.altitude, dayjs(row.time)]
            });
            res.status(200).send(ret);
            client.end();
        } catch (error) {
            res.status(500).send({ message: `Error fetching paths for ${trackid}`, error: error.message });
        }
    });
};

module.exports = { registerTracksEndpoint };