import React from 'react';
import { MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { leaveScatterMode } from '../map/scattermap';
import * as Mode from '../../mode';

export const PlaybackMenuItem = ({ state, setState, scatterState, onClose }) => {
    const handlePlayback = React.useCallback((tracks, errorMessage) => {
        if (tracks.length === 0) {
            setState({ ...state, errorMessage: errorMessage });
            return;
        }
        leaveScatterMode();
        setState({ ...state, mode: Mode.PLAYBACK_MODE, actionTargetTracks: tracks });
        onClose && onClose();
    }, [state, setState, onClose]);

    const handlePlaybackSelection = React.useCallback(() => {
        const selected = state.tracks.filter(track => scatterState.selectedTracks.has(track.getId()));
        handlePlayback(selected, '再生するトラックを選択してください');
    }, [state, scatterState.selectedTracks, handlePlayback]);

    const handlePlaybackInPerspective = React.useCallback(() => {
        handlePlayback(scatterState.tracksInPerspective, '視野内に再生可能なトラックがありません');
    }, [scatterState.tracksInPerspective, handlePlayback]);

    return (
        <>
            <MenuItem onClick={handlePlaybackSelection}>
                <ListItemIcon>
                    <PlayArrowIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="選択中のトラックを再生" />
            </MenuItem>
            <MenuItem onClick={handlePlaybackInPerspective}>
                <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="視野内のトラックを再生" />
            </MenuItem>
        </>
    );
};

