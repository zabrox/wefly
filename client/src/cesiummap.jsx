import React, { useEffect } from "react";
import * as Cesium from "cesium";

export let viewer = undefined;

const initializeCesium = async (cesiumContainerRef) => {
    console.debug('initializeCesium');
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjMxN2Y3Ni04YWU3LTQwNjctYmYyNC05Yjc4MTljOTY3OGYiLCJpZCI6MTY5NTkxLCJpYXQiOjE2OTYyNDYyMTB9.CYkH9qKRpMU0kzQWkjXuvqgr-09nICUdta83AZIxAy8";
    viewer = new Cesium.Viewer(cesiumContainerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(Number(import.meta.env.VITE_IMAGERY_ASSET_ID))),
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: true,
        terrainShadows: Cesium.ShadowMode.DISABLED,
    });
    // viewer.scene.globe.depthTestAgainstTerrain = true;
    // const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207, {
    //     dynamicScreenSpaceError: true,
    //     dynamicScreenSpaceErrorDensity: 100.0,
    //     dynamicScreenSpaceErrorFactor: 100.0,
    // });
    // viewer.scene.primitives.add(tileset);
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.0003;
    viewer.scene.fog.minimumBrightness = 0.8;
    viewer.scene.globe.atmosphereLightIntensity = 30;
    document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
    viewer.camera.percentageChanged = 0.0001;
    viewer.camera.frustum.fov = Cesium.Math.toRadians(100);
    viewer.selectionIndicator.viewModel.selectionIndicatorElement.style.visibility = 'hidden';
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.useBrowserRecommendedResolution = true;

    // export cesium viewer to global for E2E test
    window.cesiumViewer = viewer;
}

export const zoomToPoints = (cartesians) => {
    console.time('zoomToPoints');
    if (cartesians.length > 0) {
        viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    }
    console.timeEnd('zoomToPoints');
}

export const zoomToTracks = (tracks) => {
    console.time('zoomToTracks');
    let cartesians = new Array();
    if (tracks.length > 0) {
        tracks.forEach(track => {
            track.path.points.forEach(point => {
                cartesians.push(Cesium.Cartesian3.fromDegrees(...point))
            });
        });
        viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    }
    console.timeEnd('zoomToTracks');
}

export const zoomToTrackGroup = (group) => {
    viewer.camera.flyToBoundingSphere(
        Cesium.BoundingSphere.fromPoints([Cesium.Cartesian3.fromDegrees(...group.position)]), {
            duration: 1,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-60), 3000),
        });
    viewer.selectedEntity = undefined;
}

export const zoomToTrackGroups = (groups) => {
    const cartesians = groups.map(group => Cesium.Cartesian3.fromDegrees(...group.position));
    viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
    viewer.selectedEntity = undefined;
}

export const removeAllEntities = () => {
    viewer.entities.removeAll();
}

export const CesiumMapContainer = () => {
    const cesiumContainerRef = React.useRef(null);

    useEffect(() => {
        initializeCesium(cesiumContainerRef);
    }, []);

    return (
        <div ref={cesiumContainerRef} id="cesium" />
    );
};