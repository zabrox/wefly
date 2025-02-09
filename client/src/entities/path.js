import dayjs from 'dayjs';

export class Path {
    points = [];
    times = [];
    #maxAltitude = undefined;

    addPoint(longitude, latitude, altitude, time) {
        this.points.push([longitude, latitude, altitude]);
        this.times.push(time);
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

    altitudes() {
        return this.points.map(p => p[2]);
    }
    maxAltitude() {
        if (this.#maxAltitude === undefined) {
            this.#maxAltitude = Math.max(...this.altitudes());
        }
        return this.#maxAltitude;
    }

    static deserialize(dto) {
        const path = new Path();
        path.points = dto.points;
        path.times = dto.times.map(t => dayjs(t));
        return path;
    }
}