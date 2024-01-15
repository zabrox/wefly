import React from 'react';
import dayjs from 'dayjs';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as Mode from './mode';
import { PlaybackMap, stopPlayback } from './playbackmap';
import { PlayList } from './playlist';
import { Box } from '@mui/material';
import './playbackcontrolpanel.css';

export const PlaybackControlPanel = ({ state, setState }) => {
    if (state.mode !== Mode.PLAYBACK_MODE) {
        return null;
    }

    const [playbackState, setPlaybackState] = React.useState({
        currentTime: dayjs(),
    });

    const backToScatterMode = () => {
        stopPlayback();
        setState({ ...state, mode: Mode.SCATTER_MODE });
    };

    const handleTickEvent = (date) => {
        setPlaybackState({ ...playbackState, currentTime: date })
    }

    return (
        <div id='playback-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <PlaybackMap playbackTracks={state.actionTargetTracks} onTickEventHandler={handleTickEvent} />
            {state.controlPanelSize !== 0 &&
                <div>
                    <Box id='back-button-container'>
                        <ArrowBackIcon id='back-button-icon' onClick={backToScatterMode} />
                        <Button id='back-button' onClick={backToScatterMode}>トラック一覧に戻る</Button>
                    </Box>
                    <Typography id='playback-title'>トラックの再生</Typography>
                    <Box id='playback-info-container'>
                        <Typography id='playback-time'>
                            {playbackState.currentTime.format('YYYY-MM-DD hh:mm:ss')}
                        </Typography>
                        <Typography id='playbacknumber-label'>
                            {state.actionTargetTracks.length} tracks
                        </Typography>
                    </Box>
                </div>
            }
            <PlayList state={state} playbackState={playbackState} />
        </div >
    );
};