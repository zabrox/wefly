import * as Cesium from 'cesium';
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';

const POINTS_INTERVAL = 60;
const entities = [];

const trackPointEntitiyId = (track, index) => {
    return `trackpoint-${track.getId()}-${index}`;
}
const initializeTrackPointEntities = (track) => {
    let lastPoint = track.path.times[0];
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    cartesians.forEach((cartesian, index) => {
        if (index > 0 && track.path.times[index].diff(lastPoint, 'seconds') < POINTS_INTERVAL) {
            return;
        }
        lastPoint = track.path.times[index];
        entities.push(CesiumMap.viewer.entities.add({
            id: trackPointEntitiyId(track, index),
            type: 'trackpoint',
            trackid: track.getId(),
            position: cartesian,
            name: track.metadata.pilotname,
            point: {
                pixelSize: 4,
                color: trackColor(track).withAlpha(0.7),
                outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
                outlineWidth: 1,
                scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.5),
            },
        }));
    });
};

const needToShowTrackPoints = (track, selectedTracks, selectedTrackGroups) => {
    return selectedTrackGroups.containsTrack(track) && !selectedTracks.has(track.getId());
}

export const renderTrackPoints = (track, selectedTracks, selectedTrackGroups) => {
    let firstpoint = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, 0));
    if (firstpoint === undefined) {
        initializeTrackPointEntities(track);
        firstpoint = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, 0));
    }
    const trackpointShow = needToShowTrackPoints(track, selectedTracks, selectedTrackGroups);
    if (firstpoint.show === trackpointShow) {
        return;
    }
    for (let i = 0; i < track.path.points.length; i++) {
        const entity = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, i));
        if (entity !== undefined && entity.show != trackpointShow) {
            entity.show = trackpointShow;
        }
    }
}

export const trackPointClick = (entityId, handleTrackPointClick) => {
    const index = entityId.id.split('-')[2];
    handleTrackPointClick(entityId.trackid, index);
}

export const removeTrackPointEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}
