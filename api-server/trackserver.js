const dayjs = require('dayjs');
const { Storage } = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const { groupTracks } = require('./trackgrouper.js');
const { Track } = require('./common/track.js');
const { Metadata } = require('./common/metadata.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const collection = "metadatas";

const lakeBucketName = 'wefly-lake';

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

const postPath = async (track) => {
    const fileName = `paths/${track.getId()}.json`;
    const storage = new Storage();
    const bucket = storage.bucket(lakeBucketName);
    const file = bucket.file(fileName);

    const json = JSON.stringify(track.path.points.map((point, index) => {
        return [...point, track.path.times[index].toDate()];
    }));
    file.save(json);
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
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const date = req.query.date;
        const metadatas = await fetchMetadata(date);
        res.status(200).send(metadatas);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching track', error: error.message });
    }
}

const getPath = async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    if (req.query.trackids === undefined) {
        res.status(400).send('Bad Request');
        return;
    }
    const trackids = req.query.trackids.split(',');
    const storage = new Storage();
    const bucket = storage.bucket(lakeBucketName);
    const ret = {};
    try {
        const promises = trackids.map(async (trackid) => {
            const fileName = `paths/${trackid}.json`;
            const file = bucket.file(fileName);
            const [content] = await file.download();
            ret[trackid] = JSON.parse(content.toString());
        });

        await Promise.all(promises);

        res.status(200).send(ret);
    } catch (error) {
        res.status(500).send({ message: `Error fetching paths for ${trackids}`, error: error.message });
    }
}

const getTrackGroups = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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
    const bucket = storage.bucket(lakeBucketName);
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