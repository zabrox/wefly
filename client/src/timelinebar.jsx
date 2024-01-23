import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import * as CesiumMap from './cesiummap';
import './timelinebar.css';

const calculateTimeLinePosition = (currentTime) => {
    const totalFlightDuration = Cesium.JulianDate.secondsDifference(
        CesiumMap.viewer.clock.stopTime,
        CesiumMap.viewer.clock.startTime);
    const currentPosition = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ')),
        CesiumMap.viewer.clock.startTime) / totalFlightDuration * 100;
    return currentPosition;
}

export const TimelineBar = ({ tracks, playbackState, setPlaybackState }) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const timelineBarStyle = React.useMemo(() => {
        const playlistTable = document.getElementById('playlist-table');
        let height = 0;
        if (playlistTable && playlistTable.getClientRects()[0]){
            height = playlistTable.getClientRects()[0].height;
        }

        return {
            position: 'relative',
            left: `${calculateTimeLinePosition(playbackState.currentTime)}%`,
            height: height,
            width: '3px',
            background: '#e95800',
        };
    }, [tracks, playbackState]);

    const timelineHandleStyle = React.useMemo(() => {
        const timelineContainer = document.getElementById('timelinebar-container');
        let left = 0;
        const radius = 18;
        if (timelineContainer && timelineContainer.getClientRects()[0]) {
            const rect = timelineContainer.getClientRects()[0];
            left = rect.left + rect.width * calculateTimeLinePosition(playbackState.currentTime) / 100 - radius - 1;
        }

        return {
            position: 'fixed',
            left: left,
            top: '80%',
            height: `${radius * 2}px`,
            width: `${radius * 2}px`,
            color: '#ffffff',
            borderRadius: '50%',
            backgroundColor: '#e95800',
            borderStyle: 'solid',
            borderColor: '#ffffff',
            borderWidth: '3px',
        };
    }, [tracks, playbackState]);

    const handleMouseDown = ((e) => {
        setIsDragging(true);
        CesiumMap.viewer.clock.shouldAnimate = false;
    });
    const handleMouseUp = ((e) => {
        setIsDragging(false);
        CesiumMap.viewer.clock.shouldAnimate = true;
    });
    const handleMouseMove = React.useCallback((e) => {
        if (isDragging) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const totalFlightDuration = Cesium.JulianDate.secondsDifference(
                CesiumMap.viewer.clock.stopTime,
                CesiumMap.viewer.clock.startTime);
            const currentTime = dayjs(Cesium.JulianDate.toDate(Cesium.JulianDate.addSeconds(
                CesiumMap.viewer.clock.startTime,
                totalFlightDuration * x / rect.width,
                new Cesium.JulianDate())));
            CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
            setPlaybackState({ ...playbackState, currentTime: currentTime });
        }
    }, [playbackState]);
    const handleTouchMove = React.useCallback((e) => {
        if (isDragging) {
            const rect = document.getElementById('timelinebar-container').getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const totalFlightDuration = Cesium.JulianDate.secondsDifference(
                CesiumMap.viewer.clock.stopTime,
                CesiumMap.viewer.clock.startTime);
            const currentTime = dayjs(Cesium.JulianDate.toDate(Cesium.JulianDate.addSeconds(
                CesiumMap.viewer.clock.startTime,
                totalFlightDuration * x / rect.width,
                new Cesium.JulianDate())));
            CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ'));
            setPlaybackState({ ...playbackState, currentTime: currentTime });
        }
    }, [playbackState]);

    return (
        <div id='timelinebar-container'
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <div id='timeline-bar'
                style={timelineBarStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            />
            <div id='timeline-handle'
                style={timelineHandleStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            />
        </div>
    )
}