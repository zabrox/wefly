// Required modules
const Firestore = require('@google-cloud/firestore');
const fs = require('fs');
const csv = require('csv-parser');
const { classToPlain } = require('class-transformer');
const { extractTakeoffLanding } = require('./extractTakeoffLanding');

const db = new Firestore({
    porjectId: 'wefly-407313',
});

function getKey(takeoffLanding) {
    return `${takeoffLanding.name}_${takeoffLanding.longitude}_${takeoffLanding.latitude}`;
}

async function registerTakeoff(takeoffs) {
    for (const takeoff of takeoffs) {
        try {
            const data = classToPlain(takeoff);
            await db.collection("takeoffs").doc(getKey(takeoff)).set(data);
            console.log('Takeoff registered:', takeoff.name);
        } catch (err) {
            console.error('Error registering takeoff:', takeoff.name, err);
        }
    }
}
async function registerLanding(landings) {
    for (const landing of landings) {
        try {
            const data = classToPlain(landing);
            await db.collection("landings").doc(getKey(landing)).set(data);
            console.log('Landing registered:', landing.name);
        } catch (err) {
            console.error('Error registering landing:', landing.name, err);
        }
    }
}

async function readCSVFile(filePath) {
    const organizations = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => organizations.push(row))
            .on('end', () => resolve(organizations))
            .on('error', (err) => reject(err));
    });
}

async function registerOrganizations() {
    try {
        const organizations = await readCSVFile('./organization.csv');
        for (const organization of organizations) {
            try {
                await db.collection("organizations").doc(organization.name).set(organization);
                console.log('Organization registered:', organization.name);
            } catch (err) {
                console.error('Error registering organization:', organization.name, err);
            }
        }
    } catch (err) {
        console.error('Error reading CSV file:', err);
    }
}

async function main() {
    const [takeoffs, landings] = await extractTakeoffLanding('./パラグライダーマップ.kml');
    await registerTakeoff(takeoffs);
    await registerLanding(landings);
    await registerOrganizations();
}

main();
