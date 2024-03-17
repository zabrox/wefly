export class TrackGroup {
    groupid = 0;
    position = undefined;
    trackIds = [];

    constructor(groupid, position, trackIds) {
        this.groupid = groupid;
        this.position = position;
        this.trackIds = trackIds;
    }
}