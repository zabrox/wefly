import React from 'react';
import { AppBar, Typography } from '@mui/material';
import { ScatterControlPanel } from './scattercontrolpanel';
import { PlaybackControlPanel } from './playbackcontrolpanel';
import { Dragger } from "./dragger";
import { ControlPanelToggle } from "./controlpaneltoggle";
import { SCATTER_MODE } from './mode';
import { judgeMedia } from './media';
import './controlpanel.css';

export const ControlPanel = () => {
    const defaultControlPanelSize = judgeMedia().isPc ?
        document.documentElement.clientWidth * 0.4 : document.documentElement.clientWidth * 0.85;

    const [state, setState] = React.useState({
        tracks: [],
        trackGroups: [],
        controlPanelSize: defaultControlPanelSize,
        mode: SCATTER_MODE,
    });

    return (
        <div id='control-panel-wrapper'>
            <div id='control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
                <AppBar id='app-bar' position="static">
                    <Typography id='title' variant="h5" >
                        WeFly
                    </Typography>
                </AppBar>
                <ScatterControlPanel state={state} setState={setState} />
                <PlaybackControlPanel state={state} setState={setState} />
            </div>
            {/* <Dragger
                state={state}
                setState={setState} /> */}
            <ControlPanelToggle
                controlPanelSize={state.controlPanelSize}
                setControlPanelSize={(width) => setState({ ...state, controlPanelSize: width })} />
        </div >
    );
};
