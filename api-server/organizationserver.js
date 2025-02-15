const Firestore = require('@google-cloud/firestore');
const { Organization } = require('./entity/organization.js');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const takeoffLandingCollectionName = "organization";

const getOrganization = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        const collectionRef = await db.collection(takeoffLandingCollectionName);
        const snapshot = await collectionRef.get()
        const organizations = [];
        for (const doc of snapshot.docs) {
            const organization = new Organization(
                doc.get('organization'),
            );
            organization.homepage = doc.get('HP');
            organization.blog = doc.get('Blog');
            organization.facebook = doc.get('Facebook');
            organization.instagram = doc.get('Instagram');
            organizations.push(organization);
        }
        res.json({ 'organizations': organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const registerOrganizationEndpoint = (app) => {
    app.get('/api/organization', async (req, res) => {
        getOrganization(req, res);
    });
};

module.exports = { registerOrganizationEndpoint };