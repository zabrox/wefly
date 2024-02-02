import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import * as CesiumMap from './cesiummap';

const speed = 32;
const trailTime = 900;
let clickHandler = undefined;
let onTickFollowTrackRemoveCallback = undefined;
let onTickRemoveCallback = undefined;
let previousTime;

const followTrack = (entity) => {
    const pathEntity = CesiumMap.viewer.entities.getById(entity.id);
    if (!pathEntity) return;

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
        previousTime = currentTime;

        const currentPosition = trackPositionProperty.getValue(currentTime);
        if (currentPosition) {
            const distance = Cesium.Cartesian3.distance(CesiumMap.viewer.camera.positionWC, currentPosition);
            CesiumMap.viewer.camera.lookAt(
                currentPosition,
                new Cesium.HeadingPitchRange(CesiumMap.viewer.camera.heading, CesiumMap.viewer.camera.pitch, distance)
            );
        }
    });
}

const focusOnEntity = (entity) => {
    const currentTime = CesiumMap.viewer.clock.currentTime;
    const position = entity.position.getValue(currentTime);
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
                    const track = state.actionTargetTracks.find((track) => track.id === entityId.trackid);
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
    return `playback-point-${track.id}`;
}

const createPathEntity = (track) => {
    const pathEntity = CesiumMap.viewer.entities.add({
        position: new Cesium.SampledPositionProperty(),
        path: {
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: track.color,
                outlineColor: track.color.withAlpha(0.3),
                outlineWidth: 1,
            }),
            width: 2,
            leadTime: 0,
            trailTime: trailTime,
        }
    });
    const positionProperty = pathEntity.position;
    for (let i = 0; i < track.cartesians.length; i++) {
        const time = Cesium.JulianDate.fromIso8601(track.times[i].format('YYYY-MM-DDTHH:mm:ssZ'));
        positionProperty.addSample(time, track.cartesians[i]);
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
            material: new Cesium.ColorMaterialProperty(track.color.brighten(0.3, new Cesium.Color()).withAlpha(0.2)),
            outline: false,
        }
    });
}

const createPlaybackPoint = (track, positionProperty) => {
    CesiumMap.viewer.entities.add({
        id: playbackPointId(track),
        position: positionProperty,
        trackid: track.id,
        point: {
            pixelSize: 2,
            color: track.color.brighten(0.5, new Cesium.Color()),
            outlineColor: track.color.darken(0.2, new Cesium.Color()),
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
    return `label-${track.id}`;
}
const createPilotLabels = (track, positionProperty) => {
    CesiumMap.viewer.entities.add({
        id: labelId(track),
        position: positionProperty, // Cesium.Cartesian3 position
        trackid: track.id,
        label: {
            text: track.pilotname,
            font: '30px Arial',
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -25), // Adjust as needed
            fillColor: Cesium.Color.BLACK,
            showBackground: true,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            backgroundColor: track.color.withAlpha(0.8),
            backgroundPadding: new Cesium.Cartesian2(13, 13),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
            scale: 0.3,
            scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 0.3),
        }
    });
}

const playback = (targetTracks) => {
    if (targetTracks.length === 0) {
        return;
    }
    const sortedByStart = targetTracks.toSorted((a, b) => {
        const d1 = new Date(a.startTime());
        const d2 = new Date(b.startTime());
        return d1 - d2;
    });
    const reversedByEnd = targetTracks.toSorted((a, b) => {
        const d1 = new Date(a.endTime());
        const d2 = new Date(b.endTime());
        return d2 - d1;
    });
    const start = Cesium.JulianDate.fromIso8601(sortedByStart[0].times[0].format('YYYY-MM-DDTHH:mm:ssZ'));
    const stop = Cesium.JulianDate.fromIso8601(reversedByEnd[0].times[reversedByEnd[0].times.length - 1].format('YYYY-MM-DDTHH:mm:ssZ'));
    Cesium.JulianDate.addSeconds(stop, trailTime + 60, stop);
    CesiumMap.viewer.clock.startTime = start;
    CesiumMap.viewer.clock.stopTime = stop;
    CesiumMap.viewer.clock.currentTime = start.clone();
    CesiumMap.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // Loop at the end
    CesiumMap.viewer.clock.multiplier = speed;

    sortedByStart.forEach((track) => {
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
        playback(state.actionTargetTracks);
    }, [state.actionTargetTracks]);
    React.useEffect(() => {
        focusOnTrack(playbackState.selectedTrack);
    }, [playbackState.selectedTrack]);

    return null;
}