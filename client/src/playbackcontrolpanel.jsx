import React from 'react';
import * as Mode from './mode';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './playbackcontrolpanel.css';
import { PlaybackMap, stopPlayback } from './playbackmap';
import { PlayList } from './playlist';
import { Box } from '@mui/material';
import './playbackcontrolpanel.css';

export const PlaybackControlPanel = ({ state, setState }) => {
    if (state.mode !== Mode.PLAYBACK_MODE) {
        return null;
    }

    const backToScatterMode = () => {
        stopPlayback();
        setState({ ...state, mode: Mode.SCATTER_MODE });
    };

    return (
        <div id='playback-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <PlaybackMap playbackTracks={state.actionTargetTracks} />
            {state.controlPanelSize !== 0 &&
                <Box id='back-button-container'>
                    <ArrowBackIcon id='back-button-icon' onClick={backToScatterMode} />
                    <Button id='back-button' onClick={backToScatterMode}>トラック一覧に戻る</Button>
                </Box>
            }
            {state.controlPanelSize !== 0 &&
                <Typography id='playback-title'>トラックの再生</Typography>
            }
            <PlayList state={state} />
        </div >
    );
};