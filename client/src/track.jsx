import * as Cesium from "cesium";
import dayjs from "dayjs";

const colorpallete = [
    Cesium.Color.RED,
    Cesium.Color.BLUE,
    Cesium.Color.YELLOW,
    Cesium.Color.ORANGE,
    Cesium.Color.PURPLE,
    Cesium.Color.CYAN,
    Cesium.Color.CHARTREUSE,
    Cesium.Color.CRIMSON,
    Cesium.Color.CORAL,
    Cesium.Color.GOLD,
    Cesium.Color.MAGENTA];

export class Track {
    pilotname = "";
    cartesians = new Array();
    altitudes = new Array();
    times = new Array();
    show = false
    color;
    id;
    distance = 0;
    #maxAltitude = undefined;

    constructor() {
        this.color = colorpallete[Math.floor(Math.random() * colorpallete.length)];
        this.id = crypto.randomUUID();
    }

    duration() {
        if (this.times.length === 0) {
            return 0;
        }
        const duration = this.times[this.times.length - 1].diff(this.times[0], 'minutes');
        return duration;
    }

    durationStr() {
        return `${Math.floor(this.duration() / 60)} h ${this.duration() % 60} m`;
    }

    startTime() {
        if (this.times.length === 0) {
            return undefined;
        }
        return this.times[0].format('YYYY-MM-DD HH:mm:ss');
    }

    pointtime(index) {
        if (this.times.length <= index) {
            return undefined;
        }
        return this.times[index].format('YYYY-MM-DD HH:mm:ss');
    }

    maxAltitude() {
        if (this.#maxAltitude === undefined) {
            this.#maxAltitude = Math.max(...this.altitudes);
        }
        return this.#maxAltitude;
    }
}

export const parseTrackJson = (json) => {
    const track = new Track();
    track.pilotname = json.pilotname;
    track.distance = json.distance;
    if (json.area !== undefined) {
        track.area = json.area.split('_')[0];
    }
    json.track_points.forEach(point => {
        track.cartesians.push(Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude));
        track.altitudes.push(point.altitude);
        track.times.push(dayjs(point.time));
    });
    return track;
}