import React from "react";
import track_group_pin from '/images/track_group_pin.svg';
import * as Cesium from "cesium";
import * as CesiumMap from '../../cesiummap';
import { trackColor } from '../../util/trackcolor';

let removeCameraMoveEvent = undefined;
let clickHandler = undefined;

const POINTS_INTERVAL = 60;

const trackPointEntitiyId = (track, index) => {
    return `trackpoint-${track.getId()}-${index}`;
}
const initializeTrackPointEntities = (track) => {
    let lastPoint = track.path.times[0];
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    cartesians.forEach((cartesian, index) => {
        if (track.path.times[index].diff(lastPoint, 'seconds') < POINTS_INTERVAL) {
            return;
        }
        lastPoint = track.path.times[index];
        CesiumMap.viewer.entities.add({
            id: trackPointEntitiyId(track, index),
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
            description: `
                    <table>
                        <tr><th>Time</th><td>${track.path.times[index].format('YYYY-MM-DD HH:mm:ss')}</td></tr>
                        <tr><th>Altitude</th><td>${track.path.altitudes()[index]}m</td></tr>
                    </table>
                `,
        });
    });
};

const tracklineEntitiyId = (track) => {
    return `trackline-${track.getId()}`;
}
const initializeTrackLineEntity = (track) => {
    const color = trackColor(track);
    const cartesians = track.path.points.map((point) => Cesium.Cartesian3.fromDegrees(...point));
    CesiumMap.viewer.entities.add({
        id: tracklineEntitiyId(track),
        trackid: track.getId(),
        polyline: {
            positions: cartesians,
            width: 4,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: color.brighten(0.5, new Cesium.Color()),
                outlineColor: color,
                outlineWidth: 2,
            }),
        },
        show: false,
    });
};

const initializeTrackEntity = (track) => {
    initializeTrackLineEntity(track);
    initializeTrackPointEntities(track);
}

const trackGroupEntitiyId = (trackGroup) => {
    return `trackgroup-${trackGroup.groupid}`;
}
const initializeTrackGroupEntity = (trackGroups) => {
    const MIN_ICON_SIZE = 30;
    const MAX_ICON_SIZE = 250;
    const COEFFICIENT = (MAX_ICON_SIZE - MIN_ICON_SIZE) / 200;
    trackGroups.forEach(trackGroup => {
        let size = MIN_ICON_SIZE + trackGroup.trackIds.length * COEFFICIENT;
        size = size > MAX_ICON_SIZE ? MAX_ICON_SIZE : size;
        CesiumMap.viewer.entities.add({
            id: trackGroupEntitiyId(trackGroup),
            position: Cesium.Cartesian3.fromDegrees(...trackGroup.position),
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
                if ('trackid' in entityId) {
                    handleTrackPointClick(entityId.trackid);
                } else if ('groupid' in entityId) {
                    handleTrackGroupClick(entityId.groupid, trackGroups);
                } else {
                    CesiumMap.viewer.selectedEntity = undefined;
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const hideTrack = (track) => {
    const entity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
    if (entity !== undefined) entity.show = false;

    for (let i = 0; i < track.path.points.length; i++) {
        const entity = CesiumMap.viewer.entities.getById(trackPointEntitiyId(track, i));
        if (entity !== undefined) {
            entity.show = false;
        }
    }
}

const showTracks = (tracks, selectedTracks) => {
    const tracksWithPath = tracks.filter(track => track.path.points.length > 0);
    if (tracksWithPath.length === 0) {
        return;
    }
    tracksWithPath.forEach(track => {
        let entity = CesiumMap.viewer.entities.getById(tracklineEntitiyId(track));
        if (entity === undefined) {
            initializeTrackEntity(track);
            return;
        }

        entity.show = selectedTracks.has(track.getId());
    });
}

const hideFilteredTracks = (tracks, filter) => {
    const tracksWithPath = tracks.filter(track => track.path.points.length > 0);
    if (tracksWithPath.length === 0) {
        return;
    }
    tracksWithPath.forEach(track => {
        if (filter.filtersTrack(track)) {
            hideTrack(track);
        }
    });
}

const showTrackGroups = (trackGroups) => {
    if (trackGroups.length === 0) {
        return;
    }
    const entity = CesiumMap.viewer.entities.getById(trackGroupEntitiyId(trackGroups[0]));
    if (entity === undefined) {
        initializeTrackGroupEntity(trackGroups);
    }
    trackGroups.forEach(group => {
        const entity = CesiumMap.viewer.entities.getById(trackGroupEntitiyId(group));
        if (entity !== undefined) {
            entity.show = true;
        }
    });
}

const hideTrackGroupsCloseToCamera = (trackGroups, selectedTrackGroups) => {
    selectedTrackGroups.forEach(group => {
        const distance = Cesium.Cartesian3.distance(CesiumMap.viewer.camera.position, Cesium.Cartesian3.fromDegrees(...group.position));
        if (distance < 50000) {
            const entity = CesiumMap.viewer.entities.getById(trackGroupEntitiyId(group));
            if (entity !== undefined) {
                entity.show = false;
            }
        }
    });
}

const registerEventListenerOnCameraMove = (tracks, trackGroups, filter, selectedTrackGroups, selectedTracks) => {
    if (removeCameraMoveEvent !== undefined) {
        removeCameraMoveEvent();
    }
    removeCameraMoveEvent = CesiumMap.viewer.camera.changed.addEventListener(() => {
        render(tracks, trackGroups, filter, selectedTrackGroups, selectedTracks);
    });
}

const render = (tracks, trackGroups, filter, selectedTrackGroups, selectedTracks) => {
    console.log('render')
    showTrackGroups(trackGroups);
    showTracks(tracks, selectedTracks);
    hideFilteredTracks(tracks, filter);
    hideTrackGroupsCloseToCamera(trackGroups, selectedTrackGroups);
}

export const leaveScatterMode = () => {
    CesiumMap.removeAllEntities();
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
        for (let i = 0; i < track.cartesians.length; i++) {
            const cartesian = track.cartesians[i];
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
        // register callbacks on click for E2E test
        // window.selectTrackGroup = (groupid) => onTrackGroupClick(groupid, state.trackGroups);
        // window.selectTrackPoint = (trackid) => onTrackPointClick(trackid, state.tracks);
    }, [state, scatterState.selectedTracks]);
    React.useEffect(() => {
        registerEventListenerOnCameraMove(state.tracks,
            state.trackGroups,
            scatterState.filter,
            scatterState.selectedTrackGroups,
            scatterState.selectedTracks);
        render(state.tracks,
            state.trackGroups,
            scatterState.filter,
            scatterState.selectedTrackGroups,
            scatterState.selectedTracks);
    }, [state, scatterState.filter, scatterState.selectedTrackGroups, scatterState.selectedTracks]);

    return null;
}
