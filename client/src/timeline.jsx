import React from 'react';
import * as Cesium from 'cesium';
import { TrackPlaybackStats } from './trackplaybackstats';
import * as CesiumMap from './cesiummap';

const CELL_WIDTH = 4;

const createContextForPast = (canvas, track) => {
    const context = canvas.getContext('2d');
    context.strokeStyle = "rgba(200,200,200,0.7)";
    context.lineWidth = 1;
    const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
    lineargradient.addColorStop(0, track.color.brighten(0.3, new Cesium.Color()).withAlpha(0.7).toCssHexString());
    lineargradient.addColorStop(1, track.color.darken(0.2, new Cesium.Color()).withAlpha(0.7).toCssHexString());
    context.fillStyle = lineargradient;
    return context;
}
const createContextForFuture = (canvas, track) => {
    const context = canvas.getContext('2d');
    context.strokeStyle = "rgba(200,200,200,0.5)";
    context.lineWidth = 1;
    const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
    lineargradient.addColorStop(0, "rgba(200,200,200,0.5)");
    lineargradient.addColorStop(1, "rgba(128,128,128,0.5)");
    context.fillStyle = lineargradient;
    return context;
}

export const Timeline = ({ track, playbackState, setPlaybackState, start, end }) => {
    const [timelineState, setTimelineState] = React.useState({
        canvas: null,
        cellNumber: 0,
        timelineCells: [],
    });

    const timelineContainer = React.useRef(null);
    const timelineCanvas = React.useRef(null);

    React.useEffect(() => {
        if (!timelineCanvas.current || !timelineContainer.current) return;

        const canvas = timelineCanvas.current;
        canvas.width = timelineContainer.current.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
        setTimelineState({ ...timelineState, cellNumber: canvas.width / CELL_WIDTH, canvas: canvas });
    }, []);

    React.useEffect(() => {
        if (!timelineState.canvas) return;
        let time = track.times[0];

        const duration = end.diff(start, 'seconds');
        const span = duration / timelineState.cellNumber;
        const cells = [];
        while (time.isBefore(track.times[track.times.length - 1])) {
            const stats = new TrackPlaybackStats(track);
            const height = timelineState.canvas.height * stats.getAverageAltitude(time, time.add(span, 'seconds')) / track.maxAltitude();
            const position = timelineState.canvas.width * time.diff(start, 'seconds') / duration;
            cells.push({ time: time, position: position, height: height });
            time = time.add(span, 'seconds');
        };
        setTimelineState({ ...timelineState, timelineCells: cells });
    }, [track, timelineState.canvas, timelineState.cellNumber]);

    React.useEffect(() => {
        if (!timelineState.canvas) return;

        const duration = end.diff(start, 'seconds');
        const span = duration / timelineState.cellNumber;
        if (playbackState.currentTime.second() % span !== 0) return;

        let context = createContextForPast(timelineState.canvas, track);
        context.clearRect(0, 0, timelineState.canvas.width, timelineState.canvas.height);

        timelineState.timelineCells.forEach((cell) => {
            if (cell.time.isAfter(playbackState.currentTime)) {
                context = createContextForFuture(timelineState.canvas, track);
            }
            context.beginPath();
            context.rect(cell.position, timelineState.canvas.height - cell.height, CELL_WIDTH * 0.7, cell.height);
            context.fill();
            context.stroke();
        });
    }, [timelineState.timelineCells, playbackState.currentTime]);


    const handleClick = (e) => {
        const rect = timelineCanvas.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const duration = end.diff(start, 'seconds');
        const currentTime = start.add(duration * x / rect.width, 'seconds');
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        const newState = { ...playbackState, currentTime: currentTime };
        if (track.times[0].isBefore(currentTime) && track.times[track.times.length - 1].isAfter(currentTime)) {
            newState.selectedTrack = track;
        }
        setPlaybackState(newState);
    }

    return (
        <div className='timeline-container' ref={timelineContainer}>
            <canvas className='timeline-canvas'
                ref={timelineCanvas}
                onClick={handleClick} />
        </div>
    );
};