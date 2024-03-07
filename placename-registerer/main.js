const axios = require('axios');
const fs = require('fs');
const turf = require('@turf/turf');
const querystring = require('querystring');

//const endpoint = 'https://www.wefly.tokyo/api/placenames';
const endpoint = 'http://localhost:8080/api/placenames';

const main = async () => {
    const filepath = process.argv[2];
    if (filepath === undefined) {
        console.error('Usage: node main.js <path>');
        return;
    }
    console.log(`processing ${filepath}`);
    const geojson = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    for (const feature of geojson.features) {
        let name = feature.properties.name;
        const center = turf.center(feature).geometry.coordinates;
        const longitude = center[0];
        const latitude = center[1];
        let altitude = feature.properties.ele;
        if (name === undefined ||
            longitude === undefined ||
            latitude === undefined) {
            continue;
        }
        name = name.replace(/\//g, ' ');
        altitude = (altitude === undefined) ? 0 : altitude;
        const properties = feature.properties;
        // POST /api/placenames
        try {
            await axios.post(endpoint, querystring.encode({
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                altitude: parseFloat(altitude),
                name: name,
                properties: properties
            }), {
                'Content-Type': 'application/x-www-form-urlencoded'
            });
            console.log(`Posted placename ${name}`);
        } catch (error) {
            console.error(`Failed to post placename ${name}: ${error.message}`);
        };
    }
}

main();