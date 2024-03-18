import { DBSCAN } from 'density-clustering';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Cartesian3 } from 'cesium';
import { TrackGroup } from '../../entities/trackgroup.js';

dayjs.extend(utc);

function distance(point1, point2) {
    const cartesian1 = Cartesian3.fromDegrees(point1[0], point1[1], point1[2]);
    const cartesian2 = Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
    return Cartesian3.distance(cartesian1, cartesian2);
}

export function groupTracks(tracks) {
    console.time('groupTracks');
    const startPositions = tracks.map(track => track.metadata.startPosition);

    const epsilon = 20000;
    const minPoints = 1;
    const db = new DBSCAN();
    const clusters = db.run(startPositions, epsilon, minPoints, distance);

    let groupid = 0;
    const groups = clusters.map(cluster => {
        const tracksInGroup = cluster.map(index => tracks[index]);
        const trackIds = tracksInGroup.map(track => track.getId());
        const group = new TrackGroup(groupid, tracksInGroup[0].metadata.startPosition, trackIds);
        groupid++;
        return group;
    });
    console.timeEnd('groupTracks');
    return groups;
}
