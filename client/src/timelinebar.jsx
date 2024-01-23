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

const TimelineBarHandle = ({tracks, playbackState, handleMouseDown}) => {
    const timelineHandleStyle = React.useMemo(() => {
        const timelineContainer = document.getElementById('timelinebar-container');
        const playlistTable = document.getElementById('playlist-table');
        let left = 0;
        let top = 0;
        const radius = 18;
        if (timelineContainer && timelineContainer.getClientRects()[0]) {
            const rect = timelineContainer.getClientRects()[0];
            left = rect.left + rect.width * calculateTimeLinePosition(playbackState.currentTime) / 100 - radius - 1;
            top = rect.top + rect.height * 0.7;
        }
        if (playlistTable && playlistTable.getClientRects()[0]) {
            const rect = playlistTable.getClientRects()[0];
            if (rect.top + rect.height < top) {
                top = rect.top + rect.height;
            }
        }

        return {
            position: 'fixed',
            left: left,
            top: top,
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

    return (
        <div id='timeline-handle'
            style={timelineHandleStyle}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        />
    );
}

const TimelineBar = ({tracks, playbackState}) => {
    const timelineBarStyle = React.useMemo(() => {
        const playlistTable = document.getElementById('playlist-table');
        let height = 0;
        if (playlistTable && playlistTable.getClientRects()[0]) {
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

    return (
        <div id='timeline-bar' style={timelineBarStyle}/>
    );
}

export const TimelineBarContainer = ({ tracks, playbackState, setPlaybackState }) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleMouseDown = ((e) => {
        setIsDragging(true);
        CesiumMap.viewer.clock.shouldAnimate = false;
    });
    const handleMouseUp = ((e) => {
        setIsDragging(false);
        CesiumMap.viewer.clock.shouldAnimate = true;
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
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <TimelineBar tracks={tracks} playbackState={playbackState} handleMouseDown={handleMouseDown}/>
            <TimelineBarHandle tracks={tracks} playbackState={playbackState} handleMouseDown={handleMouseDown}/>
        </div>
    )
}