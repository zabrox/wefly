import React from 'react';
import { AppBar, Typography } from '@mui/material';
import { ScatterControlPanel } from './scattercontrolpanel';
import './controlpanel.css';

export const ControlPanel = ({ state, setState }) => {
    return (
        <div id='control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <AppBar id='app-bar' position="static">
                <Typography id='title' variant="h5" >
                    WeFly
                </Typography>
            </AppBar>
            <ScatterControlPanel state={state} setState={setState} />
        </div >
    );
};
