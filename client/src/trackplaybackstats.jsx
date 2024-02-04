import * as Cesium from "cesium";
import dayjs, { extend } from "dayjs";
import duration from "dayjs/plugin/duration";

extend(duration);

export class TrackPlaybackStats {
    #track = undefined;

    constructor(track) {
        this.#track = track;
    }

    duration(time) {
        return dayjs.duration(time.diff(this.#track.times[0]));
    }

    #getStartEndIndex(starttime, endtime) {
        if (starttime.isAfter(endtime)) {
            return [undefined, undefined];
        }
        let startIndex = this.#track.times.findIndex((time) => {
            return time.isAfter(starttime);
        });
        startIndex = (startIndex - 1 == -1) ? undefined : startIndex - 1;

        let endIndex = this.#track.times.findIndex((time) => {
            return time.isAfter(endtime);
        });
        endIndex = (endIndex == -1) ? undefined : endIndex;
        return [startIndex, endIndex];
    }

    getAverageAltitude(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const altitudes = this.#track.altitudes.slice(startIndex, endIndex);
        const sum = altitudes.reduce((a, b) => a + b, 0);
        return sum / altitudes.length;
    }

    #distanceBetween(startIndex, endIndex) {
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const cart1 = ellipsoid.cartesianToCartographic(this.#track.cartesians[startIndex]);
        const cart2 = ellipsoid.cartesianToCartographic(this.#track.cartesians[endIndex]);
        cart1.height = 0;
        cart2.height = 0;
        return Cesium.Cartesian3.distance(
            ellipsoid.cartographicToCartesian(cart1),
            ellipsoid.cartographicToCartesian(cart2)
        );
    }

    getAverageSpeed(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const distance = this.#distanceBetween(startIndex, endIndex);
        const duration = this.#track.times[endIndex].diff(this.#track.times[startIndex], 'seconds');
        return distance / duration * 3600 / 1000;
    }

    getAverageGain(starttime, endtime) {
        const [startIndex, endIndex] = this.#getStartEndIndex(starttime, endtime);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const duration = this.#track.times[endIndex].diff(this.#track.times[startIndex], 'seconds');
        const gain = this.#track.altitudes[endIndex] - this.#track.altitudes[startIndex];
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
        const [startIndex, endIndex] = this.#getStartEndIndex(this.#track.times[0], time);
        if (startIndex === undefined || endIndex === undefined) {
            return undefined;
        }
        const distance = this.#distanceBetween(startIndex, endIndex);
        return distance / 1000;
    }

    getTotalDistance(time) {
        const [startIndex, endIndex] = this.#getStartEndIndex(this.#track.times[0], time);
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