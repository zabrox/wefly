import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { SCATTER_MODE, PLAYBACK_MODE } from './mode';

let viewer = undefined;

const initializeCesium = (cesiumContainerRef) => {
    console.debug('initializeCesium');
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjMxN2Y3Ni04YWU3LTQwNjctYmYyNC05Yjc4MTljOTY3OGYiLCJpZCI6MTY5NTkxLCJpYXQiOjE2OTYyNDYyMTB9.CYkH9qKRpMU0kzQWkjXuvqgr-09nICUdta83AZIxAy8";
    viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        timeline: true,
        animation: true,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        terrainShadows: Cesium.ShadowMode.DISABLED,
    });
    viewer.scene.globe.depthTestAgainstTerrain = false;
    viewer.fog = new Cesium.Fog({
        enabled: true,
        density: 0.0005,
        minimumBrightness: 1.0,
    });
    document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
    viewer.camera.percentageChanged = 0.0001;
}

export const zoomToTracks = (tracks) => {
    console.time('zoomToTracks');
    let cartesians = new Array();
    if (tracks.length > 0) {
        tracks.forEach(track => cartesians.push(...track.cartesians));
        viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    }
    console.timeEnd('zoomToTracks');
}

export const zoomToTrackGroup = (group) => {
    const cartesians = new Array();
    group.tracks.forEach(track => cartesians.push(...track.cartesians));
    viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    viewer.selectedEntity = undefined;
}

export const removeAllEntities = () => {
    viewer.entities.removeAll();
}

export const CesiumMapContainer = ({ state, setState, onTrackPointClick, onTrackGroupClick }) => {
    const cesiumContainerRef = React.useRef(null);

    useEffect(() => {
        initializeCesium(cesiumContainerRef);
    }, []);

    return (
        <div ref={cesiumContainerRef} id="cesium" />
    );
};