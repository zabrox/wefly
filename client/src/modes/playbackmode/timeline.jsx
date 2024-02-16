import React from 'react';
import * as Cesium from 'cesium';
import { TrackPlaybackStats } from './trackplaybackstats';
import * as CesiumMap from '../../cesiummap';
import './timeline.css';

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
const createContextForFuture = (canvas) => {
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
    const [canvas, setCanvas] = React.useState(null);
    const [timelineCells, setTimelineCells] = React.useState([]);
    const timelineContainer = React.useRef(null);
    const timelineCanvas = React.useRef(null);

    React.useEffect(() => {
        if (!timelineCanvas.current || !timelineContainer.current) return;
        const newCanvas = timelineCanvas.current;
        newCanvas.width = timelineContainer.current.getBoundingClientRect().width;
        newCanvas.height = newCanvas.getBoundingClientRect().height;
        setCanvas(newCanvas);
    }, []);

    React.useEffect(() => {
        if (!canvas) return;
        let time = track.times[0];

        const stats = new TrackPlaybackStats(track);
        const duration = end.diff(start, 'seconds');
        const cellNumber = canvas.width / CELL_WIDTH;
        const span = duration / cellNumber;
        const cells = [];
        while (time.isBefore(track.times[track.times.length - 1])) {
            const height = canvas.height * stats.getAverageAltitude(time, time.add(span, 'seconds')) / track.maxAltitude();
            const position = canvas.width * time.diff(start, 'seconds') / duration;
            cells.push({ time: time, position: position, height: height });
            time = time.add(span, 'seconds');
        };
        setTimelineCells(cells);
    }, [track, start, end, canvas]);

    React.useEffect(() => {
        if (!canvas) return;

        let context = createContextForPast(canvas, track);
        context.clearRect(0, 0, canvas.width, canvas.height);

        timelineCells.forEach((cell) => {
            if (cell.time.isAfter(playbackState.currentTime)) {
                context = createContextForFuture(canvas);
            }
            context.beginPath();
            context.rect(cell.position, canvas.height - cell.height, CELL_WIDTH * 0.7, cell.height);
            context.fill();
            context.stroke();
        });
    }, [timelineCells, playbackState.currentTime]);

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