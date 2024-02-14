class TrackGroup {
    groupid = 0;
    position = undefined;
    tracks = [];

    constructor(id, tracks) {
        this.groupid = id;
        this.tracks = tracks;
        this.position = tracks[0].path.points[0];
    }
}
module.exports = { TrackGroup };