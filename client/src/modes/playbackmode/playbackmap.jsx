import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import * as CesiumMap from '../../cesiummap';
import { trackColor } from '../../util/trackcolor';

const speed = 32;
const trailTime = 900;
let clickHandler = undefined;
let onTickFollowTrackRemoveCallback = undefined;
let onTickRemoveCallback = undefined;
let previousTime;

const followTrack = (entity) => {
    const pathEntity = CesiumMap.viewer.entities.getById(entity.id);
    if (!pathEntity) {
        return;
    }

    const trackPositionProperty = pathEntity.position;

    if (onTickFollowTrackRemoveCallback) {
        onTickFollowTrackRemoveCallback();
    }
    onTickFollowTrackRemoveCallback = CesiumMap.viewer.clock.onTick.addEventListener(function (clock) {
        const currentTime = clock.currentTime;

        // クロックが進行していない場合、更新をスキップ
        if (Cesium.JulianDate.equals(previousTime, currentTime)) {
            return;
        }
        if (previousTime === undefined) {
            previousTime = currentTime;
        }

        const currentPosition = trackPositionProperty.getValue(currentTime);
        let previsousPosition = trackPositionProperty.getValue(previousTime);
        if (!previsousPosition) {
            previsousPosition = currentPosition;
        }
        if (currentPosition && previsousPosition) {
            const distance = Cesium.Cartesian3.distance(CesiumMap.viewer.camera.positionWC, previsousPosition);
            CesiumMap.viewer.camera.lookAt(
                currentPosition,
                new Cesium.HeadingPitchRange(CesiumMap.viewer.camera.heading, CesiumMap.viewer.camera.pitch, distance)
            );
            previousTime = currentTime;
        }
    });
}

const focusOnEntity = (entity) => {
    const currentTime = CesiumMap.viewer.clock.currentTime;
    const position = entity.position.getValue(currentTime);
    if (position === undefined) {
        return;
    }
    CesiumMap.viewer.camera.lookAt(
        position,
        new Cesium.HeadingPitchRange(CesiumMap.viewer.camera.heading, CesiumMap.viewer.camera.pitch, 3000));

    followTrack(entity);
}

const registerEventHandlerOnPointClick = (state, playbackState, setPlaybackState) => {
    // Event handler for clicking on track points
    if (clickHandler) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    clickHandler = new Cesium.ScreenSpaceEventHandler(CesiumMap.viewer.scene.canvas);
    clickHandler.setInputAction((click) => {
        const pickedObject = CesiumMap.viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            const entityId = pickedObject.id;
            if (entityId instanceof Cesium.Entity) {
                if ('trackid' in entityId) {
                    focusOnEntity(entityId);
                    const track = state.actionTargetTracks.find((track) => track.getId() === entityId.trackid);
                    setPlaybackState({ ...playbackState, selectedTrack: track });
                }
            }
        } else {
            if (onTickFollowTrackRemoveCallback) {
                CesiumMap.viewer.selectedEntity = undefined;
                setPlaybackState({ ...playbackState, selectedTrack: undefined });
                CesiumMap.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
                onTickFollowTrackRemoveCallback();
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const registerEventHandlerOnTick = (onTickEventHandler) => {
    if (onTickRemoveCallback) {
        onTickRemoveCallback();
    }
    onTickRemoveCallback = CesiumMap.viewer.clock.onTick.addEventListener((clock) => {
        // クロックが進行していない場合、更新をスキップ
        if (Cesium.JulianDate.equals(previousTime, clock.currentTime)) {
            return;
        }
        onTickEventHandler(dayjs(Cesium.JulianDate.toDate(clock.currentTime)));
    });
}

const playbackPointId = (track) => {
    return `playback-point-${track.getId()}`;
}

const createPathEntity = (track) => {
    const pathEntity = CesiumMap.viewer.entities.add({
        position: new Cesium.SampledPositionProperty(),
        path: {
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: trackColor(track),
                outlineColor: trackColor(track).withAlpha(0.3),
                outlineWidth: 1,
            }),
            width: 2,
            leadTime: 0,
            trailTime: trailTime,
        }
    });
    const positionProperty = pathEntity.position;
    for (let i = 0; i < track.path.points.length; i++) {
        const time = Cesium.JulianDate.fromIso8601(track.path.times[i].format('YYYY-MM-DDTHH:mm:ssZ'));
        const cartesian = Cesium.Cartesian3.fromDegrees(...track.path.points[i]);
        positionProperty.addSample(time, cartesian);
    };
    return positionProperty;
}

const createCurtain = (track, positionProperty) => {
    const curtainSeconds = 30;
    CesiumMap.viewer.entities.add({
        wall: {
            positions: new Cesium.CallbackProperty(() => {
                const currentTime = CesiumMap.viewer.clock.currentTime;
                const positions = [];
                for (let i = 0; i < curtainSeconds; i++) {
                    const c = positionProperty.getValue(Cesium.JulianDate.addSeconds(currentTime, -i, new Cesium.JulianDate()), new Cesium.Cartesian3());
                    if (c) positions.push(c);
                }
                return positions;
            }, false),
            material: new Cesium.ColorMaterialProperty(trackColor(track).brighten(0.3, new Cesium.Color()).withAlpha(0.2)),
            outline: false,
        }
    });
}

const createPlaybackPoint = (track, positionProperty) => {
    if (CesiumMap.viewer.entities.getById(playbackPointId(track)) !== undefined) {
        return;
    }
    CesiumMap.viewer.entities.add({
        id: playbackPointId(track),
        position: positionProperty,
        trackid: track.getId(),
        point: {
            pixelSize: 2,
            color: trackColor(track).brighten(0.5, new Cesium.Color()),
            outlineColor: trackColor(track).darken(0.2, new Cesium.Color()),
            outlineWidth: 1,
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 1.0),
        }
    });
}

export const focusOnTrack = (track) => {
    if (!track) {
        return;
    }
    const entity = CesiumMap.viewer.entities.getById(playbackPointId(track));
    if (entity) {
        focusOnEntity(entity);
    }
}

const labelId = (track) => {
    return `label-${track.getId()}`;
}
const createPilotLabels = (track, positionProperty) => {
    if (CesiumMap.viewer.entities.getById(labelId(track)) !== undefined) {
        return;
    }
    CesiumMap.viewer.entities.add({
        id: labelId(track),
        position: positionProperty, // Cesium.Cartesian3 position
        trackid: track.getId(),
        label: {
            text: track.metadata.pilotname,
            font: '30px Arial',
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -25), // Adjust as needed
            fillColor: Cesium.Color.BLACK,
            showBackground: true,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor: trackColor(track).withAlpha(0.8),
            backgroundPadding: new Cesium.Cartesian2(13, 13),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
            scale: 0.3,
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.3),
        }
    });
}

const setClock = (startTime, stopTime) => {
    const start = Cesium.JulianDate.fromIso8601(startTime.format('YYYY-MM-DDTHH:mm:ssZ'));
    const stop = Cesium.JulianDate.fromIso8601(stopTime.format('YYYY-MM-DDTHH:mm:ssZ'));
    Cesium.JulianDate.addSeconds(stop, trailTime + 60, stop);
    CesiumMap.viewer.clock.startTime = start;
    CesiumMap.viewer.clock.stopTime = stop;
    CesiumMap.viewer.clock.currentTime = start.clone();
    CesiumMap.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
    CesiumMap.viewer.clock.multiplier = speed;
}

const playback = (targetTracks, startTime, stopTime) => {
    if (startTime === undefined || stopTime === undefined) {
        return;
    }
    setClock(startTime, stopTime);

    targetTracks.forEach((track) => {
        const positionProperty = createPathEntity(track);
        createCurtain(track, positionProperty);
        createPlaybackPoint(track, positionProperty);
        createPilotLabels(track, positionProperty);
    });
    CesiumMap.viewer.infoBox.container.style.display = 'none';

    setTimeout(() => CesiumMap.viewer.clock.shouldAnimate = true, 1000);
}

export const stopPlayback = () => {
    CesiumMap.viewer.clock.shouldAnimate = false;
    CesiumMap.viewer.infoBox.container.style.display = 'block';
    CesiumMap.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    CesiumMap.removeAllEntities();
    if (clickHandler) {
        clickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        clickHandler = undefined;
    }
    if (onTickFollowTrackRemoveCallback) {
        onTickFollowTrackRemoveCallback();
    }
    if (onTickRemoveCallback) {
        onTickRemoveCallback();
    }
}

export const PlaybackMap = ({ state, playbackState, setPlaybackState, onTickEventHandler }) => {
    React.useEffect(() => {
        registerEventHandlerOnPointClick(state, playbackState, setPlaybackState);
        registerEventHandlerOnTick(onTickEventHandler);
        playback(state.actionTargetTracks, playbackState.startTime, playbackState.stopTime);
    }, [state.actionTargetTracks, playbackState.startTime, playbackState.stopTime]);
    React.useEffect(() => {
        focusOnTrack(playbackState.selectedTrack);
    }, [playbackState.selectedTrack]);

    return null;
}