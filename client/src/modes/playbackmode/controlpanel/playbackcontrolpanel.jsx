import React from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Mode from '../../mode';
import * as CesiumMap from '../../../cesiummap';
import { PlaybackMap, stopPlayback } from '../map/playbackmap';
import { PlayList } from './playlist';
import './playbackcontrolpanel.css';

export const PlaybackControlPanel = ({ state, setState, playbackState, setPlaybackState }) => {
    const backToScatterMode = React.useCallback(() => {
        stopPlayback();
        setPlaybackState({ ...playbackState, selectedTrack: undefined });
        setState({ ...state, mode: Mode.SCATTER_MODE });
    }, [state, playbackState]);

    const handleTickEvent = React.useCallback((date) => {
        if (date.unix() % (CesiumMap.viewer.clock.multiplier / 4) !== 0) {
            return;
        }
        setPlaybackState(playbackState => {
            return { ...playbackState, currentTime: date };
        });
    }, [playbackState]);

    if (state.mode !== Mode.PLAYBACK_MODE) {
        return null;
    }

    return (
        <div id='playback-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <PlaybackMap
                state={state}
                playbackState={playbackState}
                setPlaybackState={setPlaybackState}
                onTickEventHandler={handleTickEvent} />
            <div>
                <Box id='back-button-container'>
                    <ArrowBackIcon id='back-button-icon' onClick={backToScatterMode} />
                    <Button id='back-button' onClick={backToScatterMode}>トラック一覧に戻る</Button>
                </Box>
                <Typography id='playback-title'>トラックの再生</Typography>
                <Box id='playback-info-container'>
                    <Typography id='playbacknumber-label'>
                        {state.actionTargetTracks.length} tracks
                    </Typography>
                </Box>
            </div>
            <PlayList state={state} playbackState={playbackState} setPlaybackState={setPlaybackState} />
        </div >
    );
};