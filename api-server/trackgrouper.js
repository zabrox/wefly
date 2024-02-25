const { DBSCAN } = require('density-clustering');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Cartesian3 } = require('cesium');
const { TrackGroup } = require('./common/trackgroup.js');

dayjs.extend(utc);

function distance(point1, point2) {
    const cartesian1 = Cartesian3.fromDegrees(point1[0], point1[1], point1[2]);
    const cartesian2 = Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
    return Cartesian3.distance(cartesian1, cartesian2);
}

function groupTracks(metadatas) {
    const startPositions = metadatas.map(metadata => metadata.startPosition);

    const epsilon = 20000;
    const minPoints = 1;
    const db = new DBSCAN();
    const clusters = db.run(startPositions, epsilon, minPoints, distance);

    let groupid = 0;
    const groups = clusters.map(cluster => {
        const metadatasInGroup = cluster.map(index => metadatas[index]);
        const group = new TrackGroup(groupid, metadatasInGroup);
        groupid++;
        return group;
    });
    return groups;
}

module.exports = { groupTracks };