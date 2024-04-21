import React from "react";
import * as Cesium from "cesium";
import * as CesiumMap from '../../../cesiummap';
import { renderTrackGroups, removeTrackGroupEntities } from "./trackgrouprenderer";
import { renderTracks, removeTrackEntities } from "./trackrenderer";
import { trackPointClick } from "./trackpointrenderer";
import { trackLineClick } from "./tracklinerenderer";

let removeCameraMoveEvent = undefined;
let clickHandler = undefined;

const registerEventHandlerOnPointClick = (handleTrackPointClick, handleTrackGroupClick, tracks, trackGroups) => {
    if (tracks.length === 0 || trackGroups.length === 0) {
        return;
    }
    // Event handler for clicking on track points
    if (clickHandler !== undefined) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((click) => {
        const pickedObject = CesiumMap.viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entityId = pickedObject.id;
            if (entityId instanceof Cesium.Entity) {
                if (entityId.type === 'trackpoint') {
                    trackPointClick(entityId, handleTrackPointClick);
                } else if (entityId.type === 'trackline') {
                    trackLineClick(entityId, tracks, click.position, handleTrackPointClick);
                } else if (entityId.type === 'trackgroup') {
                    handleTrackGroupClick(entityId.groupid, trackGroups);
                }
                CesiumMap.viewer.selectedEntity = undefined;
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const registerEventListenerOnCameraMove = (
    tracks, trackGroups, selectedTracks, selectedTrackGroups, selectedTrackPoint) => {
    if (removeCameraMoveEvent !== undefined) {
        removeCameraMoveEvent();
    }
    removeCameraMoveEvent = CesiumMap.viewer.camera.changed.addEventListener(() => {
        render(tracks, trackGroups, selectedTracks, selectedTrackGroups, selectedTrackPoint);
    });
}

const render = (tracks, trackGroups, selectedTracks, selectedTrackGroups, selectedTrackPoint) => {
    renderTrackGroups(trackGroups, selectedTrackGroups);
    renderTracks(tracks, selectedTracks, selectedTrackGroups, selectedTrackPoint);
}

export const leaveScatterMode = () => {
    removeTrackEntities();
    removeTrackGroupEntities();
    removeCameraMoveEvent();
    if (clickHandler) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        clickHandler = undefined;
    }
}

export const getTracksInPerspective = (tracks) => {
    const camera = CesiumMap.viewer.scene.camera;
    const frustum = CesiumMap.viewer.scene.camera.frustum;
    const cullingVolume = frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
    const visibleTracks = [];
    tracks.forEach(track => {
        for (let i = 0; i < track.path.points.length; i++) {
            const cartesian = Cesium.Cartesian3.fromDegrees(...track.path.points[i]);
            if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian, 100)) === Cesium.Intersect.INSIDE) {
                visibleTracks.push(track);
                break;
            }
        };
    });
    return visibleTracks;
}

export const ScatterMap = ({ onTrackPointClick, onTrackGroupClick, state, scatterState }) => {
    React.useEffect(() => {
        registerEventHandlerOnPointClick(onTrackPointClick, onTrackGroupClick, state.tracks, state.trackGroups);
    }, [state, scatterState.selectedTrackGroups, scatterState.selectedTracks]);
    React.useEffect(() => {
        registerEventListenerOnCameraMove(state.tracks,
            state.trackGroups,
            scatterState.selectedTracks,
            scatterState.selectedTrackGroups,
            scatterState.selectedTrackPoint);
        render(state.tracks,
            state.trackGroups,
            scatterState.selectedTracks,
            scatterState.selectedTrackGroups,
            scatterState.selectedTrackPoint);
    }, [state, scatterState.selectedTrackGroups, scatterState.selectedTracks, scatterState.selectedTrackPoint]);

    return null;
}
