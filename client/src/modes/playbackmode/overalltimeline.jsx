import React from 'react';
import * as Cesium from 'cesium';
import * as CesiumMap from '../../cesiummap';

const CELL_WIDTH = 4;

const createContextForPast = (canvas) => {
    const context = canvas.getContext('2d');
    context.strokeStyle = "rgba(200,200,200,0.7)";
    context.lineWidth = 1;
    const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
    lineargradient.addColorStop(0, "rgba(255,255,255,0.5)");
    lineargradient.addColorStop(1, "rgba(200,200,200,0.5)");
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

export const OverallTimeline = ({ playbackState, setPlaybackState }) => {
    const [canvas, setCanvas] = React.useState(null);
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

        const cellNumber = canvas.width / CELL_WIDTH;
        const start = playbackState.startTime;
        const end = playbackState.stopTime;
        const span = end.diff(start, 'seconds') / cellNumber;
        let context = createContextForPast(canvas);
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < cellNumber; i++) {
            const time = start.add(span * i, 'seconds');
            if (time.isAfter(playbackState.currentTime)) {
                context = createContextForFuture(canvas);
            }
            context.beginPath();
            context.rect(i * CELL_WIDTH, 0, CELL_WIDTH * 0.7, canvas.height);
            context.fill();
            context.stroke();
        }
    }, [playbackState.currentTime]);

    const handleClick = (e) => {
        const rect = timelineCanvas.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const start = playbackState.startTime;
        const end = playbackState.stopTime;
        const duration = end.diff(start, 'seconds');
        const currentTime = start.add(duration * x / rect.width, 'seconds');
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        const newState = { ...playbackState, currentTime: currentTime };
        setPlaybackState(newState);
    }

    return (
        <div className='overall-timeline-container' ref={timelineContainer}>
            <canvas className='overall-timeline-canvas'
                ref={timelineCanvas}
                onClick={handleClick} />
        </div>
    );
};