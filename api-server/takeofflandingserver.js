const Firestore = require('@google-cloud/firestore');
const { Takeoff } = require('./entity/takeoff.js');
const { Landing } = require('./entity/landing.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const takeoffCollectionName = "takeoffs";
const landingCollectionName = "landings";

const getTakeoffs = async () => {
    const takeoffCollectionRef = await db.collection(takeoffCollectionName);
    const takeoffSnapshot = await takeoffCollectionRef.get()
    const takeoffs = [];
    for (const doc of takeoffSnapshot.docs) {
        takeoffs.push(new Takeoff(
            doc.get('name'),
            doc.get('organization'),
            doc.get('longitude'),
            doc.get('latitude'),
            doc.get('altitude'),
            doc.get('direction')
        ));
    }
    return takeoffs;
}

const getLandings = async () => {
    const landingCollectionRef = await db.collection(landingCollectionName);
    const landingSnapshot = await landingCollectionRef.get()
    const landings = [];
    for (const doc of landingSnapshot.docs) {
        landings.push(new Landing(
            doc.get('name'),
            doc.get('organization'),
            doc.get('longitude'),
            doc.get('latitude'),
            doc.get('altitude'),
        ));
    }
    return landings;
}

const getTakeoffLanding = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        const takeoffs = await getTakeoffs();
        const landings = await getLandings();
        res.json({ 'takeoffs': takeoffs, 'landings': landings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const registerTakeoffLandingEndpoint = (app) => {
    app.get('/api/takeoff_landing', async (req, res) => {
        getTakeoffLanding(req, res);
    });
};

module.exports = { registerTakeoffLandingEndpoint };