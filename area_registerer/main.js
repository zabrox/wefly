// Required modules
const Firestore = require('@google-cloud/firestore');
const fs = require('fs');
const csv = require('csv-parser');
const { classToPlain } = require('class-transformer');
const { extractTakeoffLanding } = require('./extractTakeoffLanding');

const db = new Firestore({
    porjectId: 'wefly-407313',
});

// Function to import a CSV file into a specified Firestore collection
function importCSV(filePath, collectionName, key) {
    return new Promise((resolve, reject) => {
        const docs = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => docs.push(data))
            .on('end', async () => {
                try {
                    for (const doc of docs) {
                        // Use specific field as document key based on collection
                        await db.collection(collectionName).doc(doc[key]).set(doc);
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => reject(err));
    });
}

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

async function main() {
    const [takeoffs, landings] = await extractTakeoffLanding('./パラグライダーマップ.kml')
    await registerTakeoff(takeoffs);
    await registerLanding(landings);
}

main();
