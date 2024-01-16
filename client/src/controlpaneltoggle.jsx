import React from "react";
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight';
import './controlpaneltoggle.css';

export const ControlPanelToggle = ({ state, setState }) => {
    return (
        <div id='control-panel-toggle'>
            {state.isControlPanelOpen ?
                <ArrowCircleLeft
                    id='control-panel-toggle-button'
                    onClick={() => setState({ ...state, isControlPanelOpen: false })}
                /> :
                <ArrowCircleRight
                    id='control-panel-toggle-button'
                    onClick={() => setState({ ...state, isControlPanelOpen: true })} />
            }
        </div>
    )
}