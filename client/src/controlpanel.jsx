import React from 'react';
import { WeflyAppBar } from './appbar';
import { ControlPanelToggle } from "./controlpaneltoggle";
import './controlpanel.css';

export const ControlPanel = ({ state, setState, children }) => {
    return (
        <div id='control-panel-wrapper'>
            <div id='control-panel'
                aria-hidden={!state.isControlPanelOpen}
                style={state.isControlPanelOpen
                    ? { width: state.controlPanelSize, height: '100%' }
                    : { width: 0, height: '100%', pointerEvents: 'none' }}>
                <WeflyAppBar />
                {children}
            </div>
            <ControlPanelToggle
                state={state}
                setState={setState} />
        </div >
    );
};
