import * as Cesium from 'cesium';
import * as CesiumMap from "../../../cesiummap";
import { trackColor } from '../../../util/trackcolor';

const POINTS_INTERVAL = 60;
const entities = [];
let clickHandler = undefined;

const trackPointEntitiyId = (track, index) => {
    return `trackpoint-${track.getId()}-${index}`;
}
const trackPointMarginEntitiyId = (track, index) => {
    return `trackpointmargin-${track.getId()}-${index}`;
}

const addTrackPointEntity = (track, index, cartesian) => {
    return CesiumMap.viewer.entities.add({
        id: trackPointEntitiyId(track, index),
        type: 'trackpoint',
        trackid: track.getId(),
        position: cartesian,
        name: track.metadata.pilotname,
        point: {
            pixelSize: 2,
            color: trackColor(track).withAlpha(0.6),
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.5),
        },
    });
};

const addTrackPointMarginEntity = (track, index, cartesian) => {
    return CesiumMap.viewer.entities.add({
        id: trackPointMarginEntitiyId(track, index),
        type: 'trackpoint',
        trackid: track.getId(),
        position: cartesian,
        name: track.metadata.pilotname,
        point: {
            pixelSize: 10,
            color: trackColor(track).withAlpha(0.05),
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.5),
        },
    });
};

const initializeTrackPointEntities = (track) => {
    let lastPoint = track.path.times[0];
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    cartesians.forEach((cartesian, index) => {
        if (index > 0 && track.path.times[index].diff(lastPoint, 'seconds') < POINTS_INTERVAL) {
            return;
        }
        lastPoint = track.path.times[index];
        entities.push(addTrackPointEntity(track, index, cartesian));
        entities.push(addTrackPointMarginEntity(track, index, cartesian));
    });
};

const needToShowTrackPoints = (track, selectedTracks, selectedTrackGroups, isTrackPointVisible) => {
    return isTrackPointVisible &&
        selectedTrackGroups.containsTrack(track) &&
        !selectedTracks.has(track.getId());
}

export const renderTrackPoints = (track, selectedTracks, selectedTrackGroups, isTrackPointVisible) => {
    let firstpoint = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, 0));
    if (firstpoint === undefined) {
        initializeTrackPointEntities(track);
        firstpoint = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, 0));
    }
    const trackpointShow = needToShowTrackPoints(track, selectedTracks, selectedTrackGroups, isTrackPointVisible);
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

const trackPointClick = (entityId, handleTrackPointClick) => {
    const index = entityId.id.split('-')[2];
    handleTrackPointClick(entityId.trackid, index);
}

export const registerEventHandlerOnTrackPointClick = (handleTrackPointClick, tracks) => {
    if (tracks.length === 0) {
        return;
    }
    // Event handler for clicking on track points
    if (clickHandler !== undefined) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((click) => {
        const pickedObject = CesiumMap.viewer.scene.pick(click.position);
        if (!Cesium.defined(pickedObject) || !Cesium.defined(pickedObject.id)) {
            return;
        }
        const entityId = pickedObject.id;
        if (!(entityId instanceof Cesium.Entity) || entityId.type !== 'trackpoint') {
            return;
        }
        trackPointClick(entityId, handleTrackPointClick);
        CesiumMap.viewer.selectedEntity = undefined;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export const removeTrackPointEntities = () => {
    entities.forEach((entity) => CesiumMap.viewer.entities.remove(entity));
}
