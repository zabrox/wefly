const dayjs = require('dayjs');
const { Storage } = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const { Client } = require('pg');
const { groupTracks } = require('./trackgrouper.js');
const { Track } = require('../common/track.js');
const { Metadata } = require('../common/metadata.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const collection = "metadatas";

const bucketName = 'wefly-lake';

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

const convertFromFirestoreObject = (obj) => {
    const metadata = Metadata.deserialize(obj);
    metadata.startTime = dayjs(obj.startTime.toDate());
    metadata.lastTime = dayjs(obj.lastTime.toDate());
    return metadata;
}

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

const postTracks = async (req, res) => {
    const track = Track.deserialize(req.body);
    try {
        await postPath(track);
        await postMetadata(track);
        res.status(200).send(`Path data for ${track.getId()} saved successfully.`);
    } catch (error) {
        console.error(`Error writing ${track.getId()}: ${error}`);
        res.status(500).send('Error writing path data.');
    }
}

const fetchMetadata = async (date) => {
    const collectionRef = await db.collection('metadatas');
    const snapshot = await collectionRef.where('startTime', '>=', dayjs(date).startOf('D').toDate())
        .where('startTime', '<=', dayjs(date).endOf('D').toDate())
        .get();
    if (snapshot.empty) {
        res.status(404).send('No tracks found.');
        return;
    }
    const metadatas = [];
    snapshot.forEach(element => {
        metadatas.push(convertFromFirestoreObject(element.data()));
    });
    return metadatas;
};

const getMetadata = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const date = req.query.date;
        const metadatas = await fetchMetadata(date);
        res.status(200).send(metadatas);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching track', error: error.message });
    }
}

const getPath = async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.query.trackids === undefined) {
        res.status(400).send('Bad Request');
        return;
    }
    const trackids = req.query.trackids.split(',');
    try {
        const client = getPgClient();
        client.connect();
        const query = `SELECT * FROM path WHERE trackid IN (${trackids.map((id) => `'${id}'`).join(',')}) ORDER BY trackid, time;`;
        const result = await client.query(query);
        const ret = {};
        result.rows.forEach(row => {
            if (ret[row.trackid] === undefined) ret[row.trackid] = [];
            return ret[row.trackid].push([row.longitude, row.latitude, row.altitude, dayjs(row.time)]);
        });
        res.status(200).send(ret);
        client.end();
    } catch (error) {
        res.status(500).send({ message: `Error fetching paths for ${trackids}`, error: error.message });
    }
}

const getTrackGroups = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const date = req.query.date;
        const metadatas = await fetchMetadata(date);
        const trackGroups = groupTracks(metadatas);
        res.status(200).send(trackGroups);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching trackGroups', error: error.message });
    }
}

const getPilotIcon = async (req, res) => {
    const pilotname = req.query.pilotname;
    if (!pilotname) {
        return res.status(400).send('pilotname is required');
    }

    const fileName = `pilot_icons/${pilotname}.png`;
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        // GCSからファイルの存在を確認
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).send('Icon not found');
        }

        // ファイルの読み込みとクライアントへのストリーム送信
        res.setHeader('Content-Type', 'image/png');
        const stream = file.createReadStream();
        stream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the icon');
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

    app.get('/api/trackgroups', async (req, res) => {
        getTrackGroups(req, res);
    });

    app.get('/api/track/piloticon', async (req, res) => {
        getPilotIcon(req, res);
    });
};

module.exports = { registerTracksEndpoint };