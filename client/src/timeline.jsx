import React from 'react';
import * as Cesium from 'cesium';
import dayjs from 'dayjs';
import { TableCell } from '@mui/material';
import * as CesiumMap from './cesiummap';

export const Timeline = ({ track, playbackState, setPlaybackState }) => {
    const [timelineState, setTimelineState] = React.useState({
        spanCells: [],
        canvas: null,
        cellNumber: 0,
    });

    const timelineContainer = React.useRef(null);
    const timelineCanvas = React.useRef(null);

    React.useEffect(() => {
        if (!timelineCanvas.current || !timelineContainer.current) {
            return;
        }
        const canvas = timelineCanvas.current;
        canvas.width = timelineContainer.current.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
        const context = canvas.getContext('2d');
        context.strokeStyle = "#aaa";
        context.lineWidth = 1;
        const lineargradient = context.createLinearGradient(0, 0, 0, canvas.height);
        lineargradient.addColorStop(0, track.color.brighten(0.3, new Cesium.Color()).withAlpha(0.5).toCssHexString());
        lineargradient.addColorStop(1, track.color.darken(0.2, new Cesium.Color()).withAlpha(0.5).toCssHexString());
        context.fillStyle = lineargradient;
        setTimelineState({ ...timelineState, cellNumber: canvas.width / 4, canvas: canvas });
    }, []);

    React.useEffect(() => {
        if (!timelineState.canvas) {
            return;
        }
        let time = track.times[0];

        const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
        const span = totalFlightDuration / timelineState.cellNumber;
        const spanCells = [];
        while (time.isBefore(track.times[track.times.length - 1])) {
            const height = timelineState.canvas.height * track.getAverageAltitude(time, time.add(span, 'seconds')) / track.maxAltitude();
            const position = timelineState.canvas.width * Cesium.JulianDate.secondsDifference(
                Cesium.JulianDate.fromIso8601(time.format('YYYY-MM-DDTHH:mm:ssZ')),
                CesiumMap.viewer.clock.startTime) / totalFlightDuration;
            spanCells.push({ position: position, height: height });
            time = time.add(span, 'seconds');
        }
        setTimelineState({ ...timelineState, spanCells: spanCells });
    }, [timelineState.canvas, timelineState.cellNumber]);

    React.useEffect(() => {
        if (!timelineState.canvas) {
            return;
        }
        const context = timelineState.canvas.getContext('2d');
        timelineState.spanCells.forEach(spanCell => {
            context.rect(spanCell.position, timelineState.canvas.height - spanCell.height, timelineState.canvas.width / timelineState.cellNumber * 0.7, spanCell.height);
            context.fill();
            context.stroke();
        });
    }, [timelineState]);

    const handleClick = (e) => {
        const rect = timelineCanvas.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const totalFlightDuration = Cesium.JulianDate.secondsDifference(CesiumMap.viewer.clock.stopTime, CesiumMap.viewer.clock.startTime);
        const currentTime = dayjs(Cesium.JulianDate.toDate(Cesium.JulianDate.addSeconds(
            CesiumMap.viewer.clock.startTime,
            totalFlightDuration * x / rect.width,
            new Cesium.JulianDate())));
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        setPlaybackState({ ...playbackState, currentTime: currentTime });
    }

    return (
        <div className='timeline-container' ref={timelineContainer}>
            <canvas className='timeline-canvas'
                ref={timelineCanvas}
                onClick={handleClick} />
        </div>
    );
};