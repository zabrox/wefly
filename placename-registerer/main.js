const axios = require('axios');
const fs = require('fs');
const path = require('path');

//const endpoint = 'https://www.wefly.tokyo/api/placenames';
const endpoint = 'http://localhost:8080/api/placenames';

const main = async () => {
    const directory = process.argv[2];
    if (directory === undefined) {
        console.error('Usage: node main.js <path>');
        return;
    }
    // read all json files in the directory
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.json'));
    for (const file of files) {
        console.log(`processing ${file}`);
        const geojson = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf-8'));
        for (const feature of geojson.features) {
            const name = feature.properties.name;
            const longitude = feature.geometry.coordinates[0];
            const latitude = feature.geometry.coordinates[1];
            let altitude = feature.properties.ele;
            if (name === undefined ||
                longitude === undefined ||
                latitude === undefined) {
                continue;
            }
            altitude = (altitude === undefined) ? 0 : altitude;
            // POST /api/placenames
            try {
                await axios.post(endpoint, {
                    longitude: parseFloat(longitude),
                    latitude: parseFloat(latitude),
                    altitude: parseFloat(altitude),
                    name: name,
                });
                console.log(`Posted placename ${name}`);
            } catch (error) {
                console.error(`Failed to post placename ${name}: ${error.message}`);
            };
        }
    }
}

main();