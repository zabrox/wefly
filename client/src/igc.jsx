import dayjs from "dayjs";
import { Track } from "./track";
import { Cartesian3 } from "cesium";

export function parseIgc(filename, igc) {
    let track = new Track(filename);
    const datepattern = new RegExp(/^HFDTE(\d{2})(\d{2})(\d{2})/, 'm');
    const datematch = igc.match(datepattern);
    if (datematch === null) {
        return null;
    }
    const datestr = "20" + datematch[3] + "-" + datematch[2] + "-" + datematch[1] + "T";
    igc.split('\n').forEach(line => {
        const recordType = line.charAt(0);

        if (recordType === 'B') {
            const time = line.slice(1, 7); // HHMMSS
            const timestr = time.slice(0, 2) + ":" + time.slice(2, 4) + ":" + time.slice(4, 6) + ".000Z";
            const latitude = convertDegree(parseFloat(line.slice(7, 14)) / 100000); // DDMM.MMMM format
            const longitude = convertDegree(parseFloat(line.slice(15, 23)) / 100000); // DDDMM.MMMM format
            const altitude = parseFloat(line.slice(31, 36)); // Altitude in meters

            const datetime = dayjs(datestr + timestr);
            track.cartesians.push(Cartesian3.fromDegrees(longitude, latitude, altitude));
            track.times.push(datetime);
            track.altitudes.push(altitude);
        }
    });
    return track;
}

function convertDegree(degree) {
    let a = parseInt(degree);
    return a + (degree - a) * 1.6666;
}
