import React from 'react';
import { PlaybackActionDial } from './playbackactiondial';
import * as Mode from './mode';
import './playbackcontrolpanel.css';
import { playback } from './playbackmap';

export const PlaybackControlPanel = ({ state, setState }) => {
    if (!([Mode.PLAYBACK_LIST_MODE, Mode.PLAYBACK_SELECTED_MODE]).includes(state.mode)) {
        return null;
    }

    React.useEffect(() => {
        let targets = state.tracks;
        if (state.mode === Mode.PLAYBACK_SELECTED_MODE) {
            targets = targets.filter(track => track.isSelected());
        }
        playback(targets);
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