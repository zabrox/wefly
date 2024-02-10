import { Cartesian3 } from 'cesium';

export class TrackGroup {
    groupid = 0;
    position = new Cartesian3();
    tracks = [];

    constructor(id, tracks) {
        this.groupid = id;
        this.tracks = tracks;
        this.position = tracks[0].path.points[0];
    }
}