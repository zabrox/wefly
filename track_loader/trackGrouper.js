const { DBSCAN } = require("density-clustering");
const { Cartesian3 } = require("cesium");
const dbscan = new DBSCAN();

const distance = (cartesian1, cartesian2) => {
    return Cartesian3.distance(cartesian1, cartesian2);
}

async function groupTracks(tracks) {
    const points = tracks.map(track => track.path.points[0] );

    const epsilon = 5000;
    const minPoints = 1;
    const clusters = dbscan.run(points, epsilon, minPoints, distance);

    const { TrackGroup } = await import('../common/trackgroup.mjs');
    let groupid = 0;
    const trackGroups = clusters.map(cluster => {
        const groupedTracks = cluster.map(index => tracks[index]);
        return new TrackGroup(groupid++, groupedTracks);
    });

    return trackGroups;
}

module.exports = { groupTracks };