import React from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getTracksInPerspective, leaveScatterMode } from './scattermap';
import * as Mode from '../mode';

export const ScatterActionDial = ({ state, setState, filter }) => {
    return (
        <SpeedDial id='scatter-action-dial' ariaLabel='Scatter Mode Action Dial' size="medium" icon={<PlayArrowIcon />}
            sx={{
                position: 'absolute',
                bottom: '50px',
                left: state.controlPanelSize - 85,
            }}
            FabProps={{ sx: { bgcolor: '#e95800', '&:hover': { bgcolor: '#e95800', } } }}>
            <SpeedDialAction
                key='選択中のトラックを再生'
                icon={<PlayArrowIcon />}
                tooltipTitle='選択中のトラックを再生'
                tooltipOpen
                onClick={React.useCallback(() => {
                    leaveScatterMode();
                    const selected = filter.filterTracks(state.tracks.filter(track => track.isSelected()));
                    setState({ ...state, mode: Mode.PLAYBACK_MODE, actionTargetTracks: selected });
                }, [state.tracks])}
            />,
            <SpeedDialAction
                key='視野内のトラックを再生'
                icon={<VisibilityIcon />}
                tooltipTitle='視野内のトラックを再生'
                tooltipOpen
                onClick={React.useCallback(() => {
                    const tracks = getTracksInPerspective(state.tracks);
                    leaveScatterMode();
                    setState({ ...state, mode: Mode.PLAYBACK_MODE, actionTargetTracks: filter.filterTracks(tracks) });
                }, [state.tracks, filter])}
            />
            <SpeedDialAction
                key='リスト全再生'
                icon={<PlaylistPlayIcon />}
                tooltipTitle='リスト全再生'
                tooltipOpen
                onClick={React.useCallback(() => {
                    const tracks = getTracksInPerspective(state.tracks);
                    leaveScatterMode();
                    setState({ ...state, mode: Mode.PLAYBACK_MODE, actionTargetTracks: filter.filterTracks(state.tracks) });
                }, [state.tracks, filter])}
            />
        </SpeedDial>
    );
}