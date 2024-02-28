import * as Cesium from "cesium";
import dayjs, { extend } from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import duration from "dayjs/plugin/duration";

extend(duration);
extend(isSameOrAfter);
extend(isSameOrBefore);
extend(isBetween);

export class TrackStatsCalculator {
    #track = undefined;

    constructor(track) {
        this.#track = track;
    }

    duration(time) {
        return dayjs.duration(time.diff(this.#track.path.times[0]));
    }

    #findNearestIndex(targetTime, isStart) {
        let low = 0;
        let high = this.#track.path.times.length - 1;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            const midTime = this.#track.path.times[mid];

            if (midTime.isBefore(targetTime)) {
                low = mid + 1;
            } else if (midTime.isAfter(targetTime)) {
                high = mid - 1;
            } else {
                return mid;
            }
        }

        return isStart ? Math.min(low, high): Math.max(low, high);
    }

    #getStartEndIndex(starttime, endtime) {
        if (starttime.isAfter(endtime)) {
            return [undefined, undefined];
        }
        let startIndex = this.#findNearestIndex(starttime, true);
        let endIndex = this.#findNearestIndex(endtime, false);
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
        const point1 = this.#track.path.points[startIndex];
        const point2 = this.#track.path.points[endIndex];
        if (point1 === undefined || point2 === undefined) {
            return undefined;
        }
        const cart1 = Cesium.Cartesian3.fromDegrees(...point1);
        const cart2 = Cesium.Cartesian3.fromDegrees(...point2);
        const cartographic1 = Cesium.Cartographic.fromCartesian(cart1);
        const cartographic2 = Cesium.Cartographic.fromCartesian(cart2);
        const geodesic = new Cesium.EllipsoidGeodesic(cartographic1, cartographic2);
        return geodesic.surfaceDistance;
    }

    getAverageSpeed(starttime, endtime) {
        let [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        if (startIndex === endIndex && endIndex < this.#track.path.times.length - 1) {
            endIndex++;
        }
        const distance = this.#distanceBetween(startIndex, endIndex);
        if (distance === undefined) {
            return undefined;
        }
        const duration = this.#track.path.times[endIndex].diff(this.#track.path.times[startIndex], 'seconds');
        return distance / duration * 3600 / 1000;
    }

    getAverageGain(starttime, endtime) {
        let [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        if (startIndex === endIndex && endIndex < this.#track.path.times.length - 1) {
            endIndex++;
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
        if (distance === undefined) {
            return undefined;
        }
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