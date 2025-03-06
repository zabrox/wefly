const Firestore = require('@google-cloud/firestore');
const { Organization } = require('./entity/organization.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const organizationCollectionName = "organizations";

const getOrganization = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        const collectionRef = await db.collection(organizationCollectionName);
        const snapshot = await collectionRef.get()
        const organizations = [];
        for (const doc of snapshot.docs) {
            const organization = new Organization(
                doc.get('name'),
                doc.get(' homepage')
            );
            organizations.push(organization);
        }
        res.json({ 'organizations': organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const registerOrganizationEndpoint = (app) => {
    app.get('/api/organizations', async (req, res) => {
        getOrganization(req, res);
    });
};

module.exports = { registerOrganizationEndpoint };