import { SpeedDial, SpeedDialAction } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {playback} from './playbacker';

const actions = [
    { icon: <PlayArrowIcon />, name: '再生' },
    { icon: <PlaylistPlayIcon />, name: '全て再生' },
];
export const ActionDial = ({ tracks, controlPanelSize }) => {
    return (
        <SpeedDial id='action-dial' ariaLabel='Action Dial' size="medium" icon={<RocketLaunchIcon />}
            sx={{
                position: 'absolute',
                bottom: '50px',
                left: controlPanelSize - 85,
            }}
            FabProps={{ sx: { bgcolor: '#e95800', '&:hover': { bgcolor: '#e95800', } } }}>
            <SpeedDialAction
                key='停止'
                icon={<StopIcon />}
                tooltipTitle='停止'
                tooltipOpen
                onClick={() => {
                    stopPlayback(selectedTracks);
                }}
                />
            <SpeedDialAction
                key='再生'
                icon={<PlayArrowIcon />}
                tooltipTitle='再生'
                tooltipOpen
                // onClick={() => {
                //     const selectedTracks = tracks.filter(track => !track.isFiltered() && track.isSelected());
                //     playback(selectedTracks);
                // }}
                />
            <SpeedDialAction
                key='全て再生'
                icon={<PlaylistPlayIcon />}
                tooltipTitle='全て再生'
                tooltipOpen
                onClick={() => playback(tracks)}
                />
        </SpeedDial>
    );
}