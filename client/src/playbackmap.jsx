import * as Cesium from 'cesium';
import * as CesiumMap from './cesiummap';
import { SCATTER_MODE, PLAYBACK_MODE } from './mode';

const speed = 30;
const trailTime = 900;

let playbackEntities = [];

export const playback = (targetTracks, setMode) => {
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
    console.log(sortedByStart[0].startTime());
    const start = Cesium.JulianDate.fromIso8601(sortedByStart[0].times[0].format('YYYY-MM-DDTHH:mm:ssZ'));
    console.log(start.toString());
    const stop = Cesium.JulianDate.fromIso8601(reversedByEnd[0].times[reversedByEnd[0].times.length - 1].format('YYYY-MM-DDTHH:mm:ssZ'));
    console.log(stop.toString());
    Cesium.JulianDate.addSeconds(stop, trailTime + 60, stop);
    CesiumMap.viewer.clock.startTime = start;
    CesiumMap.viewer.clock.stopTime = stop;
    CesiumMap.viewer.clock.currentTime = start.clone();
    CesiumMap.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // Loop at the end
    CesiumMap.viewer.clock.multiplier = speed;

    sortedByStart.forEach((track) => {
        const pathEntity = CesiumMap.viewer.entities.add({
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

        playbackEntities.push(CesiumMap.viewer.entities.add({
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
    CesiumMap.viewer.animation.viewModel.timeFormatter = (date, viewModel) => {
        date = Cesium.JulianDate.toDate(date);
        return `${('00' + date.getHours()).slice(-2)}:${('00' + date.getMinutes()).slice(-2)}:${('00' + date.getSeconds()).slice(-2)}`;
    };
    CesiumMap.viewer.timeline.updateFromClock();
    CesiumMap.viewer.timeline.zoomTo(start, stop);
    CesiumMap.zoomToTracks(targetTracks);
    setTimeout(() => CesiumMap.viewer.clock.shouldAnimate = true, 1000);

}

export const stopPlayback = (setMode) => {
    CesiumMap.viewer.clock.shouldAnimate = false;
    playbackEntities.forEach(entity => {
        CesiumMap.viewer.entities.remove(entity);
    })
    playbackEntities = [];
    setMode(SCATTER_MODE);
}

const showTimeline = () => {
    const timelineElement = document.querySelector('.cesium-viewer-timelineContainer');
    if (timelineElement) {
        timelineElement.style.display = 'block';
    }
    const animationElement = document.querySelector('.cesium-viewer-animationContainer');
    if (animationElement) {
        animationElement.style.display = 'block';
    }
}
