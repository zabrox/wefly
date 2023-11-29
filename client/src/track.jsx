import * as Cesium from "cesium";
import dayjs from "dayjs";
import * as dbscan from 'density-clustering';

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
    color;
    id;
    distance = 0;
    #trackEntity = undefined;
    #trackPointEntities = new Array();
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

    isShowingTrackLine() {
        return this.#trackEntity.isShowing;
    }

    showTrackLine(b) {
        this.#trackEntity.show = b;
    }

    isShowingTrackPoints() {
        return this.#trackPointEntities[0].isShowing;
    }
    showTrackPoints(b) {
        this.#trackPointEntities.forEach(entity => entity.show = b);
    }

    #initializeTrackPointEntities(viewer) {
        let lastPoint = this.times[0];
        this.cartesians.forEach((cartesian, index) => {
            if (this.times[index].diff(lastPoint, 'seconds') < 60) {
                return;
            }
            lastPoint = this.times[index];
            this.#trackPointEntities.push(viewer.entities.add({
                position: cartesian,
                name: this.pilotname,
                trackid: this.id,
                point: {
                    pixelSize: 6,
                    color: this.color.withAlpha(0.7),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    scaleByDistance: new Cesium.NearFarScalar(100, 3, 10000, 0.8),
                },
                description: `
                    <table>
                        <tr><th>Time</th><td>${this.times[index].format('YYYY-MM-DD HH:mm:ss')}</td></tr>
                        <tr><th>Altitude</th><td>${this.altitudes[index]}m</td></tr>
                    </table>
                `,
            }));
        });
    };

    #initializeTrackLineEntity(viewer) {
        this.#trackEntity = viewer.entities.add({
            polyline: {
                positions: this.cartesians,
                width: 3,
                material: this.color,
            },
        });
        this.#trackEntity.show = false;
    };

    initializeTrackEntity(viewer) {
        this.#initializeTrackLineEntity(viewer);
        this.#initializeTrackPointEntities(viewer);
    }
}

export class TrackGroup {
    cartesian = new Cesium.Cartesian3();
    tracks = new Array();
    #show = false;
    #trackGroupEntity = undefined;

    showTrackGroup(b) {
        this.#show = b;
        this.#trackGroupEntity.show = b;
    }

    initializeTrackGroupEntity(viewer) {
        this.#trackGroupEntity = viewer.entities.add({
            position: this.cartesian,
            point: {
                pixelSize: 30,
                color: Cesium.Color.RED,
            },
        });
        this.#trackGroupEntity.show = this.#show;
    }
}

const checkJsonValidity = (json) => {
    return json.hasOwnProperty('track_points') &&
        json.hasOwnProperty('pilotname') &&
        json.hasOwnProperty('distance');
}
const checkTrackPointValidity = (json) => {
    return json.hasOwnProperty('longitude') &&
        json.hasOwnProperty('latitude') &&
        json.hasOwnProperty('altitude') &&
        json.hasOwnProperty('time');
}

export const parseTrackJson = (json) => {
    const track = new Track();
    // check json validity
    if (checkJsonValidity(json) === false) {
        console.error("Invalid track json. " + json)
        return undefined;
    }
    track.pilotname = json.pilotname;
    track.distance = json.distance;
    if (json.area !== undefined) {
        track.area = json.area.split('_')[0];
    }
    json.track_points.forEach(point => {
        if (checkTrackPointValidity(point) === false) {
            console.error("Invalid track point json. " + point)
            return undefined;
        }
        track.cartesians.push(Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude));
        track.altitudes.push(point.altitude);
        track.times.push(dayjs(point.time));
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

    const groups = clusters.map(cluster => {
        const group = new TrackGroup();
        group.tracks = cluster.map((index) => tracks[index]);
        group.cartesian = group.tracks[0].cartesians[0];
        return group;
    });
    console.log(groups);
    return groups;
}