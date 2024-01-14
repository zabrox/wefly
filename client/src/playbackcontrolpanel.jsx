import React from 'react';
import { PlaybackActionDial } from './playbackactiondial';
import * as Mode from './mode';
import './playbackcontrolpanel.css';
import { PlaybackMap } from './playbackmap';

export const PlaybackControlPanel = ({ state, setState }) => {
    if (!([Mode.PLAYBACK_LIST_MODE, Mode.PLAYBACK_SELECTED_MODE]).includes(state.mode)) {
        return null;
    }

    React.useEffect(() => {
        setState({ ...state, controlPanelSize: 0});
    }, []);

    return (
        <div id='playback-control-panel' style={{ width: state.controlPanelSize, height: '100%' }}>
            <PlaybackMap mode={state.mode} tracks={state.tracks} />
            <PlaybackActionDial
                controlPanelSize={state.controlPanelSize}
                setMode={(mode) => setState({ ...state, mode: mode })} />
        </div >
    );
};