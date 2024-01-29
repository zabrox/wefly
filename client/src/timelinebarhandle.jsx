import React from 'react';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

export const TimelineBarHandle = ({ playbackState, setPlaybackState, onMouseDown }) => {
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
    const handleBackward = React.useCallback((e) => {
        const backwardTime = playbackState.currentTime.subtract(10, 'minutes');
        setPlaybackState(playbackState => {
            return {...playbackState, currentTime: backwardTime}
        });
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(backwardTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        e.stopPropagation();
    }, [playbackState]);
    const handleForward = React.useCallback((e) => {
        const forwardTime = playbackState.currentTime.add(10, 'minutes');
        setPlaybackState(playbackState => {
            return {...playbackState, currentTime: forwardTime}
        });
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(forwardTime.format('YYYY-MM-DDTHH:mm:ssZ'));
        e.stopPropagation();
    }, [playbackState]);

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
    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    return (
        <div id='timeline-handle'
            style={timelineHandleStyle}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}>
            <Typography id='timeline-handle-time'>
                {playbackState.currentTime.format('HH:mm:ss')}
            </Typography>
            <div id='timeline-handle-control-container'
                onMouseDown={stopPropagation}
                onTouchStart={stopPropagation}
                onClick={stopPropagation}>
                <FastRewindIcon id='timeline-backward-icon'
                    onClick={handleBackward} />
                <PauseIcon id='timeline-pause-icon'
                    style={{ display: isPause ? 'none' : 'block' }}
                    onClick={handlePause} />
                <PlayArrowIcon id='timeline-play-icon'
                    style={{ display: isPause ? 'block' : 'none' }}
                    onClick={handlePlay} />
                <FastForwardIcon id='timeline-forward-icon'
                    onClick={handleForward} />
            </div>
            <div id='timeline-handle-speed-control'>
                <ArrowDropDownIcon id='timeline-minus-icon'
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                    onClick={handleSpeedDown} />
                <Typography id='timeline-handle-speed'>
                    x{CesiumMap.viewer.clock.multiplier}
                </Typography>
                <ArrowDropUpIcon id='timeline-plus-icon'
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                    onClick={handleSpeedUp} />
            </div>
        </div>
    );
}