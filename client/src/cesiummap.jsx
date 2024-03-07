import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { loadPlaceNames } from "./placenameloader";

export let viewer = undefined;
let lastCameraPosition = undefined;
let removeCameraMoveEvent = undefined;
const PLACENAME_RADIUS = 5;

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
    viewer.scene.globe.depthTestAgainstTerrain = true;
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

const placenameLabelId = (placename) => {
    return `${placename.name}_${placename.longitude}_${placename.latitude}`;
}

const displayPlaceNames = (placeNames) => {
    placeNames.forEach(placename => {
        const id = placenameLabelId(placename);
        const entity = viewer.entities.getById(id);
        if (entity !== undefined) {
            return;
        }
        let text = placename.name;
        text = placename.altitude === 0 ? text : text.concat(` [${placename.altitude}m]`);
        viewer.entities.add({
            id: placenameLabelId(placename),
            position: Cesium.Cartesian3.fromDegrees(placename.longitude, placename.latitude, placename.altitude),
            label: {
                text: text,
                font: '18px sans-serif',
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                pixcelOffset: new Cesium.Cartesian2(0, -20),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scaleByDistance: new Cesium.NearFarScalar(100, 1.5, 10000, 0.3),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
                fillColor: Cesium.Color.WHITE,
            }
        })
    });
};

const registerEventListenerOnCameraMove = () => {
    if (removeCameraMoveEvent !== undefined) {
        removeCameraMoveEvent();
    }
    removeCameraMoveEvent = viewer.camera.changed.addEventListener(async () => {
        if (viewer.camera.positionCartographic.height > 10000) {
            return;
        }
        if (lastCameraPosition !== undefined) {
            const geodesic = new Cesium.EllipsoidGeodesic(lastCameraPosition, viewer.camera.positionCartographic);
            const distance = geodesic.surfaceDistance;
            if (distance < PLACENAME_RADIUS * 1000) {
                return;
            }
        }
        lastCameraPosition = viewer.camera.positionCartographic;
        const longitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude);
        const latitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude);
        loadPlaceNames(longitude, latitude, PLACENAME_RADIUS).then(placeNames => {
            displayPlaceNames(placeNames);
        });
    });
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
        registerEventListenerOnCameraMove();
    }, []);

    return (
        <div ref={cesiumContainerRef} id="cesium" />
    );
};