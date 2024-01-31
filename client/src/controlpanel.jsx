import React from 'react';
import { AppBar, Typography } from '@mui/material';
import { ControlPanelToggle } from "./controlpaneltoggle";
import './controlpanel.css';

export const ControlPanel = ({ state, setState, children }) => {
    return (
        <div id='control-panel-wrapper'>
            <div id='control-panel'
                style={state.isControlPanelOpen ? { width: state.controlPanelSize, height: '100%', } : { display: 'none' }}>
                <AppBar id='app-bar' position="static">
                    <Typography id='title' variant="h5" >
                        WeFly
                    </Typography>
                </AppBar>
                {children}
            </div>
            <ControlPanelToggle
                state={state}
                setState={setState} />
        </div >
    );
};
