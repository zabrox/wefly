const Firestore = require('@google-cloud/firestore');
const geofire = require('geofire-common');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const collectionName = "placenames";

const getPlacename = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        const longitude = parseFloat(req.query.longitude);
        const latitude = parseFloat(req.query.latitude);
        const radius = parseFloat(req.query.radius);
        console.log(`longitude: ${longitude}, latitude: ${latitude}, radius: ${radius}`);
        const bounds = geofire.geohashQueryBounds([latitude, longitude], radius * 1000);
        const collectionRef = await db.collection(collectionName);
        const promises = [];
        for (const bound of bounds) {
            promises.push(
                collectionRef.orderBy('geohash')
                    .startAt(bound[0])
                    .endAt(bound[1])
                    .get()
            );
        }
        const snapshots = await Promise.all(promises);
        if (snapshots.length === 0) {
            res.status(404).send('No places found');
            return;
        }
        const matchingDocs = [];
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const lat = doc.get('latitude');
                const lng = doc.get('longitude');
                const distanceInKm = geofire.distanceBetween([lat, lng], [latitude, longitude]);
                if (distanceInKm <= radius) {
                    matchingDocs.push(doc);
                }
            }
        }
        res.json(matchingDocs.map((doc) => doc.data()));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const postPlacename = async (req, res) => {
    try {
        const longitude = parseFloat(req.body.longitude);
        const latitude = parseFloat(req.body.latitude);
        const altitude = parseFloat(req.body.altitude);
        const name = req.body.name;
        const properties = req.body.properties;
        console.log(`longitude: ${longitude}, latitude: ${latitude}, altitude: ${altitude}, name: ${name}`)
        const keyname = `${name}_${longitude}_${latitude}`;
        const hash = geofire.geohashForLocation([latitude, longitude]);
        const docRef = await db.collection(collectionName).doc(keyname).set({
            longitude: longitude,
            latitude: latitude,
            altitude: altitude,
            geohash: hash,
            properties: properties,
            name: name,
        });
        res.status(201).send(`Document added with ID: ${docRef.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const registerPlacenameEndpoint = (app) => {
    app.post('/api/placenames', async (req, res) => {
        postPlacename(req, res);
    });

    app.get('/api/placenames', async (req, res) => {
        getPlacename(req, res);
    });
};

module.exports = { registerPlacenameEndpoint };