export class TrackGroup {
    groupid = 0;
    position = undefined;
    trackIds = [];

    constructor(groupid, position, trackIds) {
        this.groupid = groupid;
        this.position = position;
        this.trackIds = trackIds;
    }

    static deserialize(json) {
        const trackgroup = new TrackGroup();
        trackgroup.groupid = json.groupid;
        trackgroup.position = json.position;
        trackgroup.trackIds = json.trackIds;
        return trackgroup;
    }
}