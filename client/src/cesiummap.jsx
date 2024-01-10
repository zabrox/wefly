import React, { useEffect } from "react";
import * as Cesium from "cesium";
import track_group_pin from '/images/track_group_pin.svg';

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

    trackPointEntitiyId(track, index) {
        return `trackpoint-${track.id}-${index}`;
    }
    #initializeTrackPointEntities(track) {
        let lastPoint = track.times[0];
        track.cartesians.forEach((cartesian, index) => {
            if (track.times[index].diff(lastPoint, 'seconds') < 60) {
                return;
            }
            lastPoint = track.times[index];
            this.viewer.entities.add({
                id: this.trackPointEntitiyId(track, index),
                trackid: track.id,
                position: cartesian,
                name: track.pilotname,
                point: {
                    pixelSize: 4,
                    color: track.color.withAlpha(0.7),
                    outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
                    outlineWidth: 1,
                    scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.3),
                },
                description: `
                    <table>
                        <tr><th>Time</th><td>${track.times[index].format('YYYY-MM-DD HH:mm:ss')}</td></tr>
                        <tr><th>Altitude</th><td>${track.altitudes[index]}m</td></tr>
                    </table>
                `,
            });
        });
    };

    tracklineEntitiyId(track) {
        return `trackline-${track.id}`;
    }
    #initializeTrackLineEntity(track) {
        this.viewer.entities.add({
            id: this.tracklineEntitiyId(track),
            polyline: {
                positions: track.cartesians,
                width: 4,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: track.color.brighten(0.5, new Cesium.Color()),
                    outlineColor: track.color,
                    outlineWidth: 2,
                }),
            },
            show: false,
        });
        track.select(false);
    };

    onTrackLoad(tracks, trackGroups, filter) {
        this.#initializeTrackEntity(tracks);
        this.#initializeTrackGroupEntity(trackGroups);
        this.zoomToTracks(tracks);
    }
    #initializeTrackEntity(tracks) {
        tracks.forEach(track => {
            this.#initializeTrackLineEntity(track);
            this.#initializeTrackPointEntities(track);
        });
    }

    #trackGroupEntitiyId(trackGroup) {
        return `trackgroup-${trackGroup.groupid}`;
    }
    #initializeTrackGroupEntity(trackGroups) {
        const MIN_ICON_SIZE = 30;
        const MAX_ICON_SIZE = 250;
        const COEFFICIENT = (MAX_ICON_SIZE - MIN_ICON_SIZE) / 200;
        trackGroups.forEach(trackGroup => {
            let size = MIN_ICON_SIZE + trackGroup.tracks.length * COEFFICIENT;
            size = size > MAX_ICON_SIZE ? MAX_ICON_SIZE : size;
            this.viewer.entities.add({
                id: this.#trackGroupEntitiyId(trackGroup),
                position: trackGroup.cartesian,
                groupid: trackGroup.groupid,
                billboard: {
                    image: track_group_pin,
                    height: size,
                    width: size * 5 / 6,
                    pixelOffset: new Cesium.Cartesian2(0, -size / 2),
                },
                show: true,
            });
        });
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
                        handleTrackPointClick(entityId.trackid);
                    } else if ('groupid' in entityId) {
                        handleTrackGroupClick(entityId.groupid);
                    } else {
                        this.viewer.selectedEntity = undefined;
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    #showTracks(tracks, filter) {
        console.log(filter);
        const hidden = [];
        tracks.forEach(track => {
            if (filter.filtersTrack(track)) {
                hidden.push(track);
                return;
            }
            const entity = this.viewer.entities.getById(this.tracklineEntitiyId(track));
            entity.show = track.isSelected();
            for (let i = 0; i < track.cartesians.length; i++) {
                const entity = this.viewer.entities.getById(this.trackPointEntitiyId(track, i));
                if (entity === undefined) {
                    continue;
                }
                entity.show = true;
            }
        });
        this.#hideTracks(hidden);
    }
    #hideTracks(tracks) {
        tracks.forEach(track => {
            const entity = this.viewer.entities.getById(this.tracklineEntitiyId(track));
            entity.show = false;
            for (let i = 0; i < track.cartesians.length; i++) {
                const entity = this.viewer.entities.getById(this.trackPointEntitiyId(track, i));
                if (entity === undefined) {
                    continue;
                }
                entity.show = false;
            }
        });
    }

    #showTrackGroups(trackGroups) {
        trackGroups.forEach(group => {
            const entity = this.viewer.entities.getById(this.#trackGroupEntitiyId(group));
            entity.show = true;
        });
    }
    #hideTrackGroups(trackGroups) {
        trackGroups.forEach(group => {
            const entity = this.viewer.entities.getById(this.#trackGroupEntitiyId(group));
            entity.show = false;
        });
    }

    render(tracks, trackGroups, filter) {
        const cameraAltitude = this.viewer.scene.camera.positionCartographic.height;
        if (cameraAltitude > 70000) {
            this.#showTrackGroups(trackGroups);
            this.#hideTracks(tracks);
        } else {
            this.#hideTrackGroups(trackGroups);
            this.#showTracks(tracks, filter);
        }
    }

    registerEventListenerOnCameraMove(tracks, trackGroups, filter) {
        this.viewer.camera.changed.addEventListener(() => {
            this.render(tracks, trackGroups, filter);
        });
    }

    removeAllEntities() {
        this.viewer.entities.removeAll();
    }
}

export const cesiumMap = new CesiumMap();

export const CesiumMapContainer = ({ onTrackPointClick, onTrackGroupClick, tracks, trackGroups, filter }) => {
    const cesiumContainerRef = React.useRef(null);

    useEffect(() => {
        cesiumMap.initializeCesium(cesiumContainerRef);
        cesiumMap.registerEventHandlerOnPointClick(onTrackPointClick, onTrackGroupClick);
    }, []);
    useEffect(() => {
        cesiumMap.registerEventListenerOnCameraMove(tracks, trackGroups, filter);
        cesiumMap.render(tracks, trackGroups, filter);
    }, [tracks, trackGroups, filter]);

    return (
        <div ref={cesiumContainerRef} id="cesium" />
    );
};