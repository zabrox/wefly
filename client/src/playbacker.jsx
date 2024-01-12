import * as Cesium from 'cesium';
import { cesiumMap } from './cesiummap';
import { SCATTER_MODE, PLAYBACK_MODE } from './mode';

const speed = 30;
const trailTime = 900;

let playbackEntities = [];

export const playback = (targetTracks, setMode) => {
    if (targetTracks.length === 0) {
        return;
    }
    const sortedByStart = targetTracks.sort((a, b) => a.startTime().localeCompare(b.startTime()));
    const reversedByEnd = targetTracks.sort((a, b) => b.endTime().localeCompare(a.endTime()));
    const start = Cesium.JulianDate.fromIso8601(sortedByStart[0].times[0].format('YYYY-MM-DDTHH:mm:ssZ'));
    const stop = Cesium.JulianDate.fromIso8601(reversedByEnd[0].times[reversedByEnd[0].times.length - 1].format('YYYY-MM-DDTHH:mm:ssZ'));
    Cesium.JulianDate.addSeconds(stop, trailTime + 60, stop);
    cesiumMap.viewer.clock.startTime = start;
    cesiumMap.viewer.clock.stopTime = stop;
    cesiumMap.viewer.clock.currentTime = start.clone();
    cesiumMap.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // Loop at the end
    cesiumMap.viewer.clock.multiplier = speed;

    sortedByStart.forEach((track) => {
        const pathEntity = cesiumMap.viewer.entities.add({
            position: new Cesium.SampledPositionProperty(),
            path: {
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: track.color.brighten(0.5, new Cesium.Color()),
                    outlineColor: track.color,
                    outlineWidth: 2,
                }),
                width: 4,
                leadTime: 0,
                trailTime: trailTime,
            }
        });
        playbackEntities.push(pathEntity);
        const positionProperty = pathEntity.position;
        for (let i = 0; i < track.cartesians.length; i++) {
            const time = Cesium.JulianDate.fromIso8601(track.times[i].format('YYYY-MM-DDTHH:mm:ssZ'));
            positionProperty.addSample(time, track.cartesians[i]);
        };

        playbackEntities.push(cesiumMap.viewer.entities.add({
            position: positionProperty,
            point: {
                pixelSize: 8,
                color: track.color.brighten(0.5, new Cesium.Color()),
                outlineColor: track.color.darken(0.2, new Cesium.Color()),
                outlineWidth: 3,
                scaleByDistance: new Cesium.NearFarScalar(100, 2.5, 100000, 1.0),
            }
        }));
    });
    setMode(PLAYBACK_MODE);
    cesiumMap.viewer.animation.viewModel.timeFormatter = (date, viewModel) => {
        date = Cesium.JulianDate.toDate(date);
        return `${('00'+ date.getHours()).slice(-2)}:${('00' + date.getMinutes()).slice(-2)}:${('00' + date.getSeconds()).slice(-2)}`;
    };
    cesiumMap.viewer.timeline.updateFromClock();
    cesiumMap.viewer.timeline.zoomTo(start, stop);
    cesiumMap.zoomToTracks(targetTracks);
    cesiumMap.viewer.clock.shouldAnimate = true;

}

export const stopPlayback = (setMode) => {
    cesiumMap.viewer.clock.shouldAnimate = false;
    playbackEntities.forEach(entity => {
        cesiumMap.viewer.entities.remove(entity);
    })
    playbackEntities = [];
    setMode(SCATTER_MODE);
}