import React from 'react';
import { PlaybackActionDial } from './playbackactiondial';
import * as Mode from './mode';
import './playbackcontrolpanel.css';
import { playback } from './playbackmap';

export const PlaybackControlPanel = ({ state, setState }) => {
    if (state.mode !== Mode.PLAYBACK_MODE) {
        return null;
    }

    React.useEffect(() => {
        playback(state.tracks);
        setState({ ...state, controlPanelSize: 0});
    }, []);

    return (
        <div id='playback-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <PlaybackActionDial
                controlPanelSize={state.controlPanelSize}
                setMode={(mode) => setState({ ...state, mode: mode })} />
        </div >
    );
};