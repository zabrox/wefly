import React from 'react';
import * as Cesium from 'cesium';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import * as CesiumMap from '../../../cesiummap';
import { secondaryColor } from '../../../colortheme';
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
            return { ...playbackState, currentTime: backwardTime }
        });
        CesiumMap.viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(backwardTime.format('YYYY-MM-DDTHH:mm:ssZ'));
    }, [playbackState]);
    const handleForward = React.useCallback((e) => {
        const forwardTime = playbackState.currentTime.add(10, 'minutes');
        setPlaybackState(playbackState => {
            return { ...playbackState, currentTime: forwardTime }
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
        <Box id='timeline-control-container' bgcolor='primary.main'>
            <Typography id='timeline-control-time' color='primary.contrastText'>
                {playbackState.currentTime.format('HH:mm:ss')}
            </Typography>
            <Box id='timeline-control'>
                <FastRewindIcon id='timeline-overlay-fast-rewind'
                    onClick={handleBackward}
                    sx={{ color: 'primary.contrastText' }} />
                <PauseIcon id='timeline-overlay-pause'
                    onClick={handlePause}
                    style={{ display: isPause ? 'none' : 'block' }}
                    sx={{ color: 'primary.contrastText' }} />
                <PlayArrowIcon id='timeline-overlay-play'
                    onClick={handlePlay}
                    style={{ display: isPause ? 'block' : 'none' }}
                    sx={{ color: 'primary.contrastText' }} />
                <FastForwardIcon id='timeline-overlay-fast-forward'
                    onClick={handleForward}
                    sx={{ color: 'primary.contrastText' }} />
            </Box>
            <Box id='timeline-speed-control'>
                <ArrowDropDownIcon id='timeline-overlay-speed-down'
                    onClick={handleSpeedDown}
                    sx={{ color: 'primary.contrastText' }} />
                <Typography id='timeline-overlay-speed' color='primary.contrastText'>
                    x{CesiumMap.viewer.clock.multiplier}
                </Typography>
                <ArrowDropUpIcon id='timeline-overlay-speed-up'
                    onClick={handleSpeedUp}
                    sx={{ color: 'primary.contrastText' }} />
            </Box>
        </Box>
    )
}