import React from 'react';
import * as Cesium from 'cesium';
import * as CesiumMap from '../../cesiummap';
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

export const TimelineBarContainer = ({ playbackState }) => {
    return (
        <div id='timelinebar-container'>
            <TimelineBar playbackState={playbackState} />
        </div>
    )
}