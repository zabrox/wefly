// Required modules
const Firestore = require('@google-cloud/firestore');
const fs = require('fs');
const csv = require('csv-parser');

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

async function main() {
    try {
        // Adjust file paths if necessary
        await importCSV('./takeoff_landing.csv', 'takeoff_landing', 'name');
        await importCSV('./organization.csv', 'organization', 'organization');
        console.log('Data imported successfully into Firestore.');
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

main();
