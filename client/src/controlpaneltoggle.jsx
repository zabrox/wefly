import React from "react";
import { IconButton } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { judgeMedia } from "./util/media";
import './controlpaneltoggle.css';

export const ControlPanelToggle = ({ state, setState }) => {
    return (
        <div id='control-panel-toggle'>
            {state.isControlPanelOpen ? (
                <IconButton
                    id='control-panel-toggle-button'
                    size='medium'
                    color='primary'
                    aria-label='close control panel'
                    sx={judgeMedia().isPc ? { margin: '0 8px' } : { margin: '0 0 0 -44px' }}
                    onClick={React.useCallback(() => setState({ ...state, isControlPanelOpen: false }), [state])}
                >
                    <ChevronLeft />
                </IconButton>
            ) : (
                <IconButton
                    id='control-panel-toggle-button'
                    size='medium'
                    color='primary'
                    aria-label='open control panel'
                    sx={{ margin: '0 8px' }}
                    onClick={React.useCallback(() => setState({ ...state, isControlPanelOpen: true }), [state])}
                >
                    <ChevronRight />
                </IconButton>
            )}
        </div>
    )
}
