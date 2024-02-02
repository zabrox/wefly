import React from 'react';
import * as Cesium from 'cesium';
import Typography from '@mui/material/Typography';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as CesiumMap from './cesiummap';
import './timelinecontrol.css';

export const TimelineControl = ({ playbackState, setPlaybackState }) => {
    const [isPause, setIsPause] = React.useState(false);

    const handlePause = React.useCallback((e) => {
        setIsPause(!isPause);
        CesiumMap.viewer.clock.shouldAnimate = false;
    }, [isPause]);
    const handlePlay = React.useCallback((e) => {
        setIsPause(!isPause);
        CesiumMap.viewer.clock.shouldAnimate = true;
    }, [isPause]);
    const handleBackward = React.useCallback((e) => {
        const backwardTime = playbackState.currentTime.subtract(10, 'minutes');
        setPlaybackState(playbackState => {
            return {...playbackState, currentTime: backwardTime}
        });
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(backwardTime.format('YYYY-MM-DDTHH:mm:ssZ'));
    }, [playbackState]);
    const handleForward = React.useCallback((e) => {
        const forwardTime = playbackState.currentTime.add(10, 'minutes');
        setPlaybackState(playbackState => {
            return {...playbackState, currentTime: forwardTime}
        });
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(forwardTime.format('YYYY-MM-DDTHH:mm:ssZ'));
    }, [playbackState]);

    const handleSpeedUp = (e) => {
        const maxMultiplier = 128;
        const multiplier = CesiumMap.viewer.clock.multiplier;
        CesiumMap.viewer.clock.multiplier = multiplier < maxMultiplier ? multiplier * 2 : maxMultiplier;
        e.stopPropagation();
    }
    const handleSpeedDown = (e) => {
        const minMultiplier = 1;
        const multiplier = CesiumMap.viewer.clock.multiplier;
        CesiumMap.viewer.clock.multiplier = multiplier > minMultiplier ? multiplier / 2 : minMultiplier;
        e.stopPropagation();
    }
    return (
        <div id='timeline-control-container'>
            <Typography id='timeline-control-time'>
                {playbackState.currentTime.format('HH:mm:ss')}
            </Typography>
            <div id='timeline-control'>
                <FastRewindIcon id='timeline-overlay-fast-rewind' onClick={handleBackward} />
                <PauseIcon id='timeline-overlay-pause'
                    onClick={handlePause}
                    style={{ display: isPause ? 'none' : 'block' }} />
                <PlayArrowIcon id='timeline-overlay-play'
                    onClick={handlePlay}
                    style={{ display: isPause ? 'block' : 'none' }} />
                <FastForwardIcon id='timeline-overlay-fast-forward' onClick={handleForward} />
            </div>
            <div id='timeline-speed-control'>
                <ArrowDropDownIcon id='timeline-overlay-speed-down' onClick={handleSpeedDown} />
                <Typography id='timeline-overlay-speed'>
                    x{CesiumMap.viewer.clock.multiplier}
                </Typography>
                <ArrowDropUpIcon id='timeline-overlay-speed-up' onClick={handleSpeedUp} />
            </div>
        </div>
    )
}