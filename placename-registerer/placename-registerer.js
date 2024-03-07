const fs = require('fs');
const turf = require('@turf/turf');
const { Storage } = require('@google-cloud/storage');

const lakeBucketName = 'wefly-lake';

const geojsonData = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const dividedGeoJsons = {};

geojsonData.features.forEach(feature => {
    if (feature.properties.name === undefined) {
        return;
    }
    const center = turf.center(feature).geometry.coordinates;
    const key = `${center[0].toFixed(1)}_${center[1].toFixed(1)}`;
    if (!dividedGeoJsons[key]) {
        dividedGeoJsons[key] = turf.featureCollection([]);
    }
    dividedGeoJsons[key].features.push(feature);
});

Object.entries(dividedGeoJsons).forEach(([key, geoJson]) => {
    const fileName = `placenames/${key}.json`;
    const storage = new Storage();
    const bucket = storage.bucket(lakeBucketName);
    const file = bucket.file(fileName);
    file.save(JSON.stringify(geoJson));
});
