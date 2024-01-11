import React, { useEffect } from "react";
import * as Cesium from "cesium";

class CesiumMap extends React.Component {
    viewer = undefined;

    initializeCesium(cesiumContainerRef) {
        console.debug('initializeCesium');
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjMxN2Y3Ni04YWU3LTQwNjctYmYyNC05Yjc4MTljOTY3OGYiLCJpZCI6MTY5NTkxLCJpYXQiOjE2OTYyNDYyMTB9.CYkH9qKRpMU0kzQWkjXuvqgr-09nICUdta83AZIxAy8";
        this.viewer = new Cesium.Viewer(cesiumContainerRef.current, {
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
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        this.viewer.fog = new Cesium.Fog({
            enabled: true,
            density: 0.0005,
            minimumBrightness: 1.0,
        });
        document.getElementsByClassName('cesium-viewer-bottom')[0].remove();
        this.viewer.camera.percentageChanged = 0.0001;
    }

    zoomToTracks(tracks) {
        console.time('zoomToTracks');
        let cartesians = new Array();
        if (tracks.length > 0) {
            tracks.forEach(track => cartesians.push(...track.cartesians));
            this.viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
        }
        console.timeEnd('zoomToTracks');
    }

    zoomToTrackGroup(group) {
        const cartesians = new Array();
        group.tracks.forEach(track => cartesians.push(...track.cartesians));
        this.viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(cartesians), { duration: 1 });
        this.viewer.selectedEntity = undefined;
    }

    registerEventHandlerOnPointClick(handleTrackPointClick, handleTrackGroupClick) {
        // Event handler for clicking on track points
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction((click) => {
            const pickedObject = this.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
                const entityId = pickedObject.id;
                if (entityId instanceof Cesium.Entity) {
                    if ('trackid' in entityId) {
                        handleTrackPointClick(entityId);
                    } else if ('groupid' in entityId) {
                        handleTrackGroupClick(entityId);
                    } else {
                        this.viewer.selectedEntity = undefined;
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    #fadeTracksDependingOnAltitude(tracks, trackGroups) {
        const cameraAltitude = this.viewer.scene.camera.positionCartographic.height;
        if (cameraAltitude > 70000) {
            trackGroups.forEach(group => group.showTrackGroup(true));
            tracks.forEach(track => {
                track.fadeOut();
            });
        } else {
            trackGroups.forEach(group => group.showTrackGroup(false));
            tracks.forEach(track => {
                track.fadeIn();
            });
        }
    }

    registerEventListenerOnCameraMove(tracks, trackGroups) {
        this.viewer.camera.changed.addEventListener(() => {
            this.#fadeTracksDependingOnAltitude(tracks, trackGroups);
        });
    }

    removeAllEntities() {
        this.viewer.entities.removeAll();
    }
}

export const cesiumMap = new CesiumMap();

export const CesiumMapContainer = ({ onTrackPointClick, onTrackGroupClick, tracks, trackGroups }) => {
    const cesiumContainerRef = React.useRef(null);

    useEffect(() => {
        cesiumMap.initializeCesium(cesiumContainerRef);
        cesiumMap.registerEventHandlerOnPointClick(onTrackPointClick, onTrackGroupClick);
    }, []);
    useEffect(() => {
        cesiumMap.registerEventListenerOnCameraMove(tracks, trackGroups);
    }, [tracks, trackGroups]);

    return (
        <div ref={cesiumContainerRef} id="cesium" />
    );
};