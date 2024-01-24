import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import * as CesiumMap from './cesiummap';
import { TimelineBarHandle } from './timelinebarhandle';
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

const TimelineBar = ({ playbackState }) => {
    const timelineBarStyle = React.useMemo(() => {
        const playlistTable = document.getElementById('playlist-table');
        let height = 0;
        if (playlistTable && playlistTable.getBoundingClientRect()) {
            height = playlistTable.getBoundingClientRect().height;
        }

        return {
            left: `${calculateTimeLinePosition(playbackState.currentTime)}%`,
            height: height,
        };
    }, [playbackState]);

    return (
        <div id='timeline-bar' style={timelineBarStyle} />
    );
}

export const TimelineBarContainer = ({ playbackState, setPlaybackState }) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleClick = ((e) => {
        document.getElementById('playlist-table').click();
    });
    const handleMouseDown = ((e) => {
        setIsDragging(true);
    });
    const handleMouseUp = ((e) => {
        setIsDragging(false);
    });
    const handleMove = React.useCallback((x, rect) => {
        if (isDragging) {
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
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        handleMove(x, rect);
    };
    const handleTouchMove = (e) => {
        const rect = document.getElementById('timelinebar-container').getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        handleMove(x, rect);
    }

    return (
        <div id='timelinebar-container'
            onClick={handleClick}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <TimelineBar playbackState={playbackState} />
            <TimelineBarHandle playbackState={playbackState} onMouseDown={handleMouseDown} />
        </div>
    )
}