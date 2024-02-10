import * as Cesium from 'cesium';

export class Path {
    points = [];
    times = [];
    altitudes = [];
    #maxAltitude = undefined;

    addPoint(longitude, latitude, altitude, time) {
        const c = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
        this.points.push(c);
        this.times.push(time);
        this.altitudes.push(altitude);
    }

    startTime() {
        if (this.times.length === 0) {
            return undefined;
        }
        return this.times[0];
    }
    endTime() {
        if (this.times.length === 0) {
            return undefined;
        }
        return this.times[this.times.length - 1];
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

    maxAltitude() {
        if (this.#maxAltitude === undefined) {
            this.#maxAltitude = Math.max(...this.altitudes);
        }
        return this.#maxAltitude;
    }
}