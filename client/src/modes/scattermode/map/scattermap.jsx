import React from "react";
import * as Cesium from "cesium";
import * as CesiumMap from '../../../cesiummap';
import { renderTrackGroups, removeTrackGroupEntities, registerEventHandlerOnTrackGroupClick } from "./trackgrouprenderer";
import { renderTracks, removeTrackEntities, registerEventHandlerOnTrackClick } from "./trackrenderer";

let removeCameraMoveEvent = undefined;

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
        registerEventHandlerOnTrackGroupClick(onTrackGroupClick, state.trackGroups);
        registerEventHandlerOnTrackClick(onTrackPointClick, state.tracks);
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
