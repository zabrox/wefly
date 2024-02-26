export class TrackGroup {
    groupid = 0;
    position = undefined;
    trackIds = [];

    static deserialize(json) {
        const trackgroup = new TrackGroup();
        trackgroup.groupid = json.groupid;
        trackgroup.position = json.position;
        trackgroup.trackIds = json.trackIds;
        return trackgroup;
    }
}