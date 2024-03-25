const axios = require('axios');
const { parseIgc } = require('./igcParser.js');
const { findArea } = require('./areaFinder.js');
const { Path } = require('./common/path.js');

const endpoint = 'https://www.wefly.tokyo/api/tracks';
//const endpoint = 'http://localhost:8080/api/tracks';

async function saveTracks(date, tracks) {
    for (const track of tracks) {
        try {
            await parseIgc(date, track);
            if(track.path.points.length === 0) {
                console.log(`No points in track ${track.getId()}`);
                continue;
            }
        } catch (error) {
            continue;
        }
        await findArea(track);
        try {
            await axios.post(endpoint, track);
        } catch (error) {
            console.error(`Failed to post track ${track.getId()}: ${error.message}`);
        };
        // Clear path data to save memory
        track.path = new Path();
    }
}

module.exports = { saveTracks };
