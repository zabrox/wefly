import React from 'react';
import { Box, SpeedDial, SpeedDialAction } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { leaveScatterMode } from '../map/scattermap';
import * as Mode from '../../mode';

export const ScatterActionDial = ({ state, setState, scatterState }) => {
    const handlePlayback = React.useCallback((tracks, errorMessage) => {
        if (tracks.length === 0) {
            setState({ ...state, errorMessage: errorMessage });
            return;
        }
        leaveScatterMode();
        setState({ ...state, mode: Mode.PLAYBACK_MODE, actionTargetTracks: tracks });
    }, [state]);

    const handlePlaybackSelection = React.useCallback(() => {
        const selected = state.tracks.filter(track => scatterState.selectedTracks.has(track.getId()));
        handlePlayback(selected, '再生するトラックを選択してください');
    }, [state, scatterState.selectedTracks])

    const handlePlaybackInPerspective = React.useCallback(() => {
        handlePlayback(scatterState.tracksInPerspective, '視野内に再生可能なトラックがありません');
    }, [state, scatterState.tracksInPerspective]);

    return (
        <Box>
            <SpeedDial id='scatter-action-dial' ariaLabel='Scatter Mode Action Dial' size="medium" icon={<PlayArrowIcon />}
                sx={{
                    position: 'absolute',
                    bottom: '50px',
                    left: state.controlPanelSize - 85,
                }}>
                <SpeedDialAction
                    key='選択中のトラックを再生'
                    icon={<PlayArrowIcon />}
                    tooltipTitle='選択中のトラックを再生'
                    tooltipOpen
                    onClick={handlePlaybackSelection}
                />,
                <SpeedDialAction
                    key='視野内のトラックを再生'
                    icon={<VisibilityIcon />}
                    tooltipTitle='視野内のトラックを再生'
                    tooltipOpen
                    onClick={handlePlaybackInPerspective}
                />
            </SpeedDial>
        </Box>
    );
}