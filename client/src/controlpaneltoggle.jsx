import React from "react";
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight';
import { judgeMedia } from "./util/media";
import './controlpaneltoggle.css';

export const ControlPanelToggle = ({ state, setState }) => {
    return (
        <div id='control-panel-toggle'>
            {state.isControlPanelOpen ?
                <ArrowCircleLeft
                    id='control-panel-toggle-button'
                    sx={judgeMedia().isPc ? { margin: '0 10px' } : { margin: '0 0 0 -70px' }}
                    onClick={() => setState({ ...state, isControlPanelOpen: false })}
                /> :
                <ArrowCircleRight
                    id='control-panel-toggle-button'
                    sx={{ margin: '0 10px' }}
                    onClick={() => setState({ ...state, isControlPanelOpen: true })} />
            }
        </div>
    )
}