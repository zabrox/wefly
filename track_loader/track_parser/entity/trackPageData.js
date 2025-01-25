const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

class TrackPageData {
    pilotname = "";
    distance = 0;    // in km
    activity = "";
    model = "";
}

module.exports = { TrackPageData };