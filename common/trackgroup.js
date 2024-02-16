class TrackGroup {
    groupid = 0;
    position = undefined;
    trackIds = [];

    constructor(id, metadatas) {
        this.groupid = id;
        this.trackIds = metadatas.map(metadata => metadata.getId());
        this.position = metadatas[0].startPosition;
    }
}
module.exports = { TrackGroup };