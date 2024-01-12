import { SpeedDial, SpeedDialAction } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { playback } from './playbacker';

export const ScatterModeActionDial = ({ tracks, filter, controlPanelSize, setMode }) => {
    return (
        <SpeedDial id='scatter-modeaction-dial' ariaLabel='Scatter Mode Action Dial' size="medium" icon={<PlayArrowIcon />}
            sx={{
                position: 'absolute',
                bottom: '50px',
                left: controlPanelSize - 85,
            }}
            FabProps={{ sx: { bgcolor: '#e95800', '&:hover': { bgcolor: '#e95800', } } }}>
            <SpeedDialAction
                key='選択中のトラックを再生'
                icon={<PlayArrowIcon />}
                tooltipTitle='選択中のトラックを再生'
                tooltipOpen
                onClick={() => {
                    const selected = tracks.filter(track => track.isSelected())
                    playback(selected, setMode);
                }}
            />,
            <SpeedDialAction
                key='リスト全再生'
                icon={<PlaylistPlayIcon />}
                tooltipTitle='リスト全再生'
                tooltipOpen
                onClick={() => {
                    const unfiltered = filter.filterTracks(tracks);
                    playback(unfiltered, setMode);
                }}
            />
        </SpeedDial>
    );
}