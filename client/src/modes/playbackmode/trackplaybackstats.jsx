import * as Cesium from "cesium";
import dayjs, { extend } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from "dayjs/plugin/duration";

extend(duration);
extend(isSameOrAfter);
extend(isSameOrBefore);

export class TrackPlaybackStats {
    #track = undefined;

    constructor(track) {
        this.#track = track;
    }

    duration(time) {
        return dayjs.duration(time.diff(this.#track.path.times[0]));
    }

    #getStartEndIndex(starttime, endtime) {
        if (starttime.isAfter(endtime)) {
            return [undefined, undefined];
        }
        let startIndex = this.#track.path.times.findLastIndex((time) => {
            return time.isSameOrBefore(starttime);
        });
        startIndex = (startIndex == -1) ? undefined : startIndex;

        let endIndex = this.#track.path.times.findIndex((time) => {
            return time.isSameOrAfter(endtime);
        });
        endIndex = (endIndex == -1) ? undefined : endIndex;
        return [startIndex, endIndex];
    }

    getAverageAltitude(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const altitudes = this.#track.path.altitudes().slice(startIndex, endIndex + 1);
        const sum = altitudes.reduce((a, b) => a + b, 0);
        return sum / altitudes.length;
    }

    #distanceBetween(startIndex, endIndex) {
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const point1 = this.#track.path.points[startIndex];
        const point2 = this.#track.path.points[endIndex];
        const cart1 = Cesium.Cartesian3.fromDegrees(...point1);
        const cart2 = Cesium.Cartesian3.fromDegrees(...point2);
        const cartographic1 = Cesium.Cartographic.fromCartesian(cart1);
        const cartographic2 = Cesium.Cartographic.fromCartesian(cart2);
        const geodesic = new Cesium.EllipsoidGeodesic(cartographic1, cartographic2);
        return geodesic.surfaceDistance;
    }

    getAverageSpeed(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const distance = this.#distanceBetween(startIndex, endIndex);
        const duration = this.#track.path.times[endIndex].diff(this.#track.path.times[startIndex], 'seconds');
        return distance / duration * 3600 / 1000;
    }

    getAverageGain(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const duration = this.#track.path.times[endIndex].diff(this.#track.path.times[startIndex], 'seconds');
        const gain = this.#track.path.altitudes()[endIndex] - this.#track.path.altitudes()[startIndex];
        return gain / duration;
    }

    getAverageGlideRatio(starttime, endtime) {
        const distance = this.getAverageSpeed(starttime, endtime);
        const gain = this.getAverageGain(starttime, endtime);
        if (distance === undefined || gain === undefined) {
            return undefined;
        }
        return -(distance * 1000 / 3600) / gain;
    }

    getDistance(time) {
        const [startIndex, endIndex] = this.#getStartEndIndex(this.#track.path.times[0], time);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const distance = this.#distanceBetween(startIndex, endIndex);
        return distance / 1000;
    }

    getTotalDistance(time) {
        const [startIndex, endIndex] = this.#getStartEndIndex(this.#track.path.times[0], time);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        let totalDistance = 0;
        for (let i = startIndex; i < endIndex; i++) {
            totalDistance += this.#distanceBetween(i, i + 1);
        }
        return totalDistance / 1000;
    }
}