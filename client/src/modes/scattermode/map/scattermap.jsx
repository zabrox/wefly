import React from "react";
import * as Cesium from "cesium";
import * as CesiumMap from '../../../cesiummap';
import { renderTrackGroups, removeTrackGroupEntities, registerEventHandlerOnTrackGroupClick } from "./trackgrouprenderer";
import { registerEventHandlerOnTakeoffLandingClick } from "./takeoffLandings";
import { renderTracks, removeTrackEntities, registerEventHandlerOnTrackClick } from "./trackrenderer";
import { displayTakeoffLandingPins } from "./takeoffLandings";
import { TrackPoint } from "../trackpoint";

let removeCameraMoveEndEvent = undefined;
let clickHandler = undefined;

const registerEventListenerOnCameraMoveEnd = (state, scatterState, setScatterState) => {
    if (removeCameraMoveEndEvent !== undefined) {
        removeCameraMoveEndEvent();
    }
    removeCameraMoveEndEvent = CesiumMap.viewer.camera.moveEnd.addEventListener(() => {
        const tracksInPerspective = getTracksInPerspective(state.tracks);
        const trackGroupsInPerspective = getTrackGroupsInPerspective(state.trackGroups);
        setScatterState(state => ({
            ...state, tracksInPerspective: tracksInPerspective, trackGroupsInPerspective: trackGroupsInPerspective
        }));
        renderTrackGroups(state.trackGroups, scatterState.selectedTrackGroups);
    });
}

const render = (tracks, trackGroups, selectedTracks, selectedTrackGroups, selectedTrackPoint, isTrackPointVisible) => {
    renderTrackGroups(trackGroups, selectedTrackGroups);
    renderTracks(tracks, selectedTracks, selectedTrackGroups, selectedTrackPoint, isTrackPointVisible);
}

export const leaveScatterMode = () => {
    removeTrackEntities();
    removeTrackGroupEntities();
    removeCameraMoveEndEvent();
}

const getTracksInPerspective = (tracks) => {
    const camera = CesiumMap.viewer.scene.camera;
    const frustum = CesiumMap.viewer.scene.camera.frustum;
    const cullingVolume = frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
    const visibleTracks = [];
    tracks.forEach(track => {
        for (let i = 0; i < track.path.points.length; i++) {
            const cartesian = Cesium.Cartesian3.fromDegrees(...track.path.points[i]);
            if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian, 1)) === Cesium.Intersect.INSIDE) {
                visibleTracks.push(track);
                break;
            }
        };
    });
    return visibleTracks;
}

const getTrackGroupsInPerspective = (trackGroups) => {
    const camera = CesiumMap.viewer.scene.camera;
    const frustum = CesiumMap.viewer.scene.camera.frustum;
    const cullingVolume = frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
    const visibleTrackGroups = [];
    trackGroups.forEach(trackGroup => {
        const cartesian = Cesium.Cartesian3.fromDegrees(...trackGroup.position);
        if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian, 1)) === Cesium.Intersect.INSIDE) {
            visibleTrackGroups.push(trackGroup);
        }
    });
    return visibleTrackGroups;
}

const registerEventHandlerOnMapClick = (setScatterState) => {
    if (clickHandler !== undefined) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((clickEvent) => {
        // Reset selections when clicking elsewhere
        setScatterState(state => ({
            ...state,
            selectedTakeoffLanding: undefined,
            selectedTrackPoint: new TrackPoint(),
        }));
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};


export const ScatterMap = ({
    onTrackPointClick,
    onTrackGroupClick,
    state,
    scatterState,
    setScatterState }) => {

    React.useEffect(() => {
        registerEventHandlerOnTrackGroupClick(onTrackGroupClick, state.trackGroups);
        registerEventHandlerOnTrackClick(onTrackPointClick, state.tracks);
    }, [state, scatterState.selectedTrackGroups, scatterState.selectedTracks]);

    React.useEffect(() => {
        registerEventListenerOnCameraMoveEnd(
            state,
            scatterState,
            setScatterState);
    }, [state, scatterState]);

    React.useEffect(() => {
        displayTakeoffLandingPins(scatterState.takeoffs, scatterState.landings);
        registerEventHandlerOnTakeoffLandingClick(scatterState, setScatterState);
    }, [scatterState.takeoffs, scatterState.landings]);

    React.useEffect(() => {
        render(state.tracks,
            state.trackGroups,
            scatterState.selectedTracks,
            scatterState.selectedTrackGroups,
            scatterState.selectedTrackPoint,
            scatterState.isTrackPointVisible);
    }, [state,
        scatterState.selectedTrackGroups,
        scatterState.selectedTracks,
        scatterState.selectedTrackPoint,
        scatterState.isTrackPointVisible
    ]);

    React.useEffect(() => {
        registerEventHandlerOnMapClick(setScatterState);
    }, []);

    return null;
}
