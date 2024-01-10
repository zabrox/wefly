import * as Cesium from "cesium";
import dayjs from "dayjs";
import * as dbscan from 'density-clustering';

const colorpallete = [
    Cesium.Color.AQUA,
    Cesium.Color.AQUAMARINE,
    Cesium.Color.BLUEVIOLET,
    Cesium.Color.CHARTREUSE,
    Cesium.Color.CORAL,
    Cesium.Color.CRIMSON,
    Cesium.Color.CYAN,
    Cesium.Color.DARKORANGE,
    Cesium.Color.DARKORCHID,
    Cesium.Color.DEEPPINK,
    Cesium.Color.DEEPSKYBLUE,
    Cesium.Color.FUCHSIA,
    Cesium.Color.GOLD,
    Cesium.Color.GREENYELLOW,
    Cesium.Color.HOTPINK,
    Cesium.Color.LIGHTBLUE,
    Cesium.Color.LIGHTGREEN,
    Cesium.Color.LIGHTPINK,
    Cesium.Color.LIME,
    Cesium.Color.MAGENTA,
    Cesium.Color.ORANGE,
    Cesium.Color.RED,
    Cesium.Color.TOMATO,
    Cesium.Color.YELLOW,
    Cesium.Color.YELLOWGREEN,
];

const generateColor = () => {
    let i = 0;
    return () => {
        const color = colorpallete[i];
        i = (i + 1) % colorpallete.length;
        return color;
    }
}
const colorGenerator = generateColor();

export class Track {
    pilotname = "";
    cartesians = new Array();
    altitudes = new Array();
    times = new Array();
    color;
    id;
    distance = 0;
    activity = "";
    #selected = false;
    #maxAltitude = undefined;

    constructor() {
        this.color = colorGenerator();
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

    isSelected() {
        return this.#selected;
    }
    select(b) {
        this.#selected = b;
    }
}

export class TrackGroup {
    groupid = 0;
    cartesian = new Cesium.Cartesian3();
    tracks = new Array();
}

const checkJsonValidity = (json) => {
    return json.hasOwnProperty('track_points') &&
        json.hasOwnProperty('pilotname') &&
        json.hasOwnProperty('distance') &&
        json.hasOwnProperty('activity');
}
const checkTrackPointValidity = (json) => {
    return json.length === 4
}

export const parseTrackJson = (json) => {
    const track = new Track();
    // check json validity
    if (checkJsonValidity(json) === false) {
        console.error("Invalid track json. " + json)
        return undefined;
    }
    track.pilotname = json.pilotname;
    track.distance = parseFloat(json.distance.replace(' km', ''));
    if (json.area !== undefined) {
        track.area = json.area.split('_')[0];
    }
    track.activity = json.activity;
    json.track_points.forEach(point => {
        if (checkTrackPointValidity(point) === false) {
            console.error("Invalid track point json. " + point)
            return undefined;
        }
        track.cartesians.push(Cesium.Cartesian3.fromDegrees(point[2], point[1], point[3]));
        track.altitudes.push(point[3]);
        track.times.push(dayjs(point[0]));
    });
    return track;
}

const distance = (cartesian1, cartesian2) => {
    return Cesium.Cartesian3.distance(cartesian1, cartesian2);
}

export const dbscanTracks = (tracks) => {
    const points = tracks.map(track => track.cartesians[0]);

    const epsilon = 5000;
    const minPoints = 1;
    const db = new dbscan.DBSCAN();
    const clusters = db.run(points, epsilon, minPoints, distance);

    let groupid = 0;
    const groups = clusters.map(cluster => {
        const group = new TrackGroup();
        group.tracks = cluster.map((index) => tracks[index]);
        group.cartesian = group.tracks[0].cartesians[0];
        group.groupid = groupid;
        groupid++;
        return group;
    });
    return groups;
}