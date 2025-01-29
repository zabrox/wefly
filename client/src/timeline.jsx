import React from 'react';
import * as Cesium from 'cesium';
import { TrackStatsCalculator } from './entities/trackstatscalculator';
import * as CesiumMap from './cesiummap';
import { trackColor } from './util/trackcolor';
import './timeline.css';

const CELL_WIDTH = 4;

const createContextForPast = (canvas, track) => {
    const context = canvas.getContext('2d');
    context.strokeStyle = "rgba(200,200,200,0.7)";
    context.lineWidth = 1;
    const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
    lineargradient.addColorStop(0, trackColor(track).brighten(0.3, new Cesium.Color()).withAlpha(0.7).toCssHexString());
    lineargradient.addColorStop(1, trackColor(track).darken(0.2, new Cesium.Color()).withAlpha(0.7).toCssHexString());
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

export const Timeline = ({ track, currentTime, setCurrentTime, start, end, handleTimelineClick }) => {
    const [timelineCells, setTimelineCells] = React.useState([]);
    const timelineContainer = React.useRef(null);
    const timelineCanvas = React.useRef(null);

    React.useEffect(() => {
        if (!timelineCanvas.current || !timelineContainer.current) return;
        timelineCanvas.current.width = timelineContainer.current.getBoundingClientRect().width;
        timelineCanvas.current.height = timelineCanvas.current.getBoundingClientRect().height;
    }, [timelineContainer]);

    React.useEffect(() => {
        if (!timelineCanvas.current) return;
        if (end === undefined || start === undefined) return;
        let time = track.path.times[0];

        const stats = new TrackStatsCalculator(track);
        const duration = end.diff(start, 'milliseconds');
        const cellNumber = timelineCanvas.current.width / CELL_WIDTH;
        const span = duration / cellNumber;
        const cells = [];
        while (time.isBefore(track.path.times[track.path.times.length - 1])) {
            const index = parseInt(cellNumber * time.diff(start, 'milliseconds') / duration);
            const height = timelineCanvas.current.height * stats.getAverageAltitude(time, time.add(span, 'milliseconds')) / track.metadata.maxAltitude;
            console.log(`time: ${time}, index: ${index}, height: ${height}`);
            time = time.add(span, 'milliseconds');
        };
        setTimelineCells(cells);
    }, [track, start, end, timelineCanvas]);

    React.useEffect(() => {
        if (!timelineCanvas.current || timelineContainer.current.offsetWidth === 0) return;

        let context = createContextForPast(timelineCanvas.current, track);
        context.clearRect(0, 0, timelineCanvas.current.width, timelineCanvas.current.height);

        timelineCells.forEach((cell) => {
            if (cell.time.isAfter(currentTime)) {
                context = createContextForFuture(timelineCanvas.current);
            }
            context.beginPath();
            context.rect(cell.position, timelineCanvas.current.height - cell.height, CELL_WIDTH * 0.7, cell.height);
            context.fill();
            context.stroke();
        });
    }, [track, timelineCells, currentTime]);

    const handleCurrentTimeChange = (e, x) => {
        const rect = timelineCanvas.current.getBoundingClientRect();
        const clientRectX = x - rect.left;
        const duration = end.diff(start, 'seconds');
        const newCurrentTime = start.add(duration * clientRectX / rect.width, 'seconds');
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(newCurrentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        setCurrentTime(newCurrentTime);
        handleTimelineClick(e, newCurrentTime);
    }

    const handleClick = (e) => {
        handleCurrentTimeChange(e, e.clientX);
    }

    const handleSwipe = (e) => {
        handleCurrentTimeChange(e, e.changedTouches[0].clientX);
    };

    React.useEffect(() => {
        const canvas = timelineCanvas.current;
        canvas.addEventListener('touchmove', handleSwipe);
        return () => {
            canvas.removeEventListener('touchmove', handleSwipe);
        };
    }, [start, end]);

    return (
        <div className='timeline-container' ref={timelineContainer}>
            <canvas className='timeline-canvas'
                data-testid='timelinecanvas'
                ref={timelineCanvas}
                onClick={handleClick} />
        </div>
    );
};