import React from 'react';
import * as Cesium from 'cesium';
import * as CesiumMap from '../../../cesiummap';
import './timelinebar.css';

const calculateTimeLinePosition = (start, stop, currentTime) => {
    if (start === undefined || stop === undefined || currentTime === undefined) {
        return 0;
    }
    const totalFlightDuration = stop.diff(start, 'second');
    const currentPosition = currentTime.diff(start, 'second') / totalFlightDuration * 100;
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
            left: `${calculateTimeLinePosition(playbackState.startTime, playbackState.stopTime, playbackState.currentTime)}%`,
            height: height,
        };
    }, [playbackState]);

    return (
        <div id='timeline-bar' style={timelineBarStyle} />
    );
}

export const TimelineBarContainer = ({ playbackState }) => {
    return (
        <div id='timelinebar-container'>
            <TimelineBar playbackState={playbackState} />
        </div>
    )
}