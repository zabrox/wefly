const Firestore = require('@google-cloud/firestore');
const { Takeoff } = require('./entity/takeoff.js');
const { Landing } = require('./entity/landing.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const takeoffLandingCollectionName = "takeoff_landing";

const getTakeoffLanding = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        const collectionRef = await db.collection(takeoffLandingCollectionName);
        const snapshot = await collectionRef.get()
        const takeoffs = [];
        const landings = [];
        for (const doc of snapshot.docs) {
            if (doc.get('category') === 'Takeoff') {
                takeoffs.push(new Takeoff(
                    doc.get('name'),
                    doc.get('area'),
                    doc.get('organization'),
                    doc.get('longitude'),
                    doc.get('latitude'),
                    doc.get('altitude'),
                    doc.get('direction')
                ));
            } else if (doc.get('category') === 'Landing') {
                landings.push(new Landing(
                    doc.get('name'),
                    doc.get('area'),
                    doc.get('organization'),
                    doc.get('longitude'),
                    doc.get('latitude'),
                    doc.get('altitude'),
                ));
            }
        }
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