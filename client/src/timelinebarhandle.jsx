import React from 'react';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import * as Cesium from 'cesium';
import * as CesiumMap from './cesiummap';
import './timelinebarhandle.css';

const maxMultiplier = 128;
const minMultiplier = 1;

const calculateTimeLinePosition = (currentTime) => {
    const totalFlightDuration = Cesium.JulianDate.secondsDifference(
        CesiumMap.viewer.clock.stopTime,
        CesiumMap.viewer.clock.startTime);
    const currentPosition = Cesium.JulianDate.secondsDifference(
        Cesium.JulianDate.fromIso8601(currentTime.format('YYYY-MM-DDTHH:mm:ssZ')),
        CesiumMap.viewer.clock.startTime) / totalFlightDuration * 100;
    return currentPosition;
}

const calculateLeftPosition = (playbackState, timelineContainer, width) => {
    if (timelineContainer && timelineContainer.getBoundingClientRect()) {
        const rect = timelineContainer.getBoundingClientRect();
        return rect.left + rect.width * calculateTimeLinePosition(playbackState.currentTime) / 100 - width / 2 - 1;
    }
    return 0;
};

const calculateTopPosition = (playlistTable, defaultTop) => {
    if (playlistTable && playlistTable.getBoundingClientRect()) {
        const rect = playlistTable.getBoundingClientRect();
        return rect.top + rect.height < defaultTop ? rect.top + rect.height : defaultTop;
    }
    return defaultTop;
};

export const TimelineBarHandle = ({ playbackState, setPlaybackState }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isPause, setIsPause] = React.useState(false);

    const timelineHandleStyle = React.useMemo(() => {
        const timelineContainer = document.getElementById('timelinebar-container');
        const playlistTable = document.getElementById('playlist-table');
        let defaultTop = document.documentElement.clientHeight * 0.8;
        const width = 100;

        const left = calculateLeftPosition(playbackState, timelineContainer, width);
        const top = calculateTopPosition(playlistTable, defaultTop);

        return {
            left: left,
            top: top,
            width: width,
        };
    }, [playbackState]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };
    const handleMouseUp = (e) => {
        setIsDragging(false);
    };
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
    const handlePause = React.useCallback((e) => {
        setIsPause(!isPause);
        CesiumMap.viewer.clock.shouldAnimate = false;
        e.stopPropagation();
    }, [isPause]);
    const handlePlay = React.useCallback((e) => {
        setIsPause(!isPause);
        CesiumMap.viewer.clock.shouldAnimate = true;
        e.stopPropagation();
    }, [isPause]);
    const handleSpeedUp = (e) => {
        const multiplier = CesiumMap.viewer.clock.multiplier;
        CesiumMap.viewer.clock.multiplier = multiplier < maxMultiplier ? multiplier * 2 : maxMultiplier;
        e.stopPropagation();
    }
    const handleSpeedDown = (e) => {
        const multiplier = CesiumMap.viewer.clock.multiplier;
        CesiumMap.viewer.clock.multiplier = multiplier > minMultiplier ? multiplier / 2 : minMultiplier;
        e.stopPropagation();
    }

    return (
        <div id='timeline-handle'
            style={timelineHandleStyle}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}>
            <center>
                <Typography id='timeline-handle-time'>
                    {playbackState.currentTime.format('HH:mm:ss')}
                </Typography>
            </center>
            <div id='timeline-handle-control-container'>
                <FastRewindIcon id='timeline-fastrewind-icon' 
                    onClick={handleSpeedDown} />
                <PauseIcon id='timeline-pause-icon'
                    style={{ display: isPause ? 'none' : 'block' }}
                    onClick={handlePause} />
                <PlayArrowIcon id='timeline-play-icon'
                    style={{ display: isPause ? 'block' : 'none' }}
                    onClick={handlePlay} />
                <FastForwardIcon id='timeline-fastforward-icon'
                    onClick={handleSpeedUp} />
            </div>
            <center>
                <Typography id='timeline-handle-speed'>
                    x{CesiumMap.viewer.clock.multiplier}
                </Typography>
            </center>
        </div>
    );
}