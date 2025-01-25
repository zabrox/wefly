const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

class Metadata {
    pilotname = "";
    distance = 0;    // in km
    duration = 0   // in minutes
    maxAltitude = 0;
    startTime = undefined;
    lastTime = undefined;
    startPosition = undefined;
    lastPosition = undefined;
    activity = "";
    model = "";
    area = "";

    getId() {
        return (this.pilotname + '_' + this.startTime.utc().format('YYYYMMDDHHmmss')).replace(' ', '');
    }

    serialize() {
        return {
            pilotname: this.pilotname,
            distance: this.distance,
            duration: this.duration,
            maxAltitude: this.maxAltitude,
            startTime: this.startTime.toISOString(),
            lastTime: this.lastTime.toISOString(),
            startPosition: this.startPosition,
            lastPosition: this.lastPosition,
            activity: this.activity,
            model: this.model,
            area: this.area,
        };
    }

    static deserialize(json) {
        const metadata = new Metadata();
        metadata.pilotname = json.pilotname;
        metadata.distance = json.distance;
        metadata.duration = json.duration;
        metadata.maxAltitude = json.maxAltitude;
        metadata.startTime = dayjs(json.startTime);
        metadata.lastTime = dayjs(json.lastTime);
        metadata.startPosition = json.startPosition;
        metadata.lastPosition = json.lastPosition;
        metadata.activity = json.activity;
        metadata.model = json.model;
        metadata.area = json.area;
        return metadata;
    }
}

module.exports = { Metadata };