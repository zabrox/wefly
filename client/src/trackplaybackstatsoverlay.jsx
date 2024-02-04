import * as React from 'react';
import dayjs, { extend } from 'dayjs';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { Table, TableRow, TableCell, TableBody } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import duration from 'dayjs/plugin/duration';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ActivityIcon } from './activityicon';
import { TrackPlaybackStats } from './trackplaybackstats';
import { TrackPlaybackStatsTable } from './trackplaybackstatstable';
import './trackplaybackstatsoverlay.css';

extend(duration);

const ExpandStatsButton = ({ expanded, setExpanded }) => {
    const handleExpand = () => {
        setExpanded(!expanded);
    }

    const style = {
        transition: 'expanded 0.3s ease',
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    return (
        <ExpandMoreIcon
            id='track-playback-expand-stats'
            className={expanded ? 'expanded' : ''}
            style={style}
            onClick={handleExpand} />
    );
}

export const TrackPlaybackStatsOverlay = ({ playbackState }) => {
    if (playbackState.selectedTrack === undefined) return null;

    const [expanded, setExpanded] = React.useState(false);
    const selectedTrack = playbackState.selectedTrack;

    return (
        <Card id='track-playback-stats-overlay'>
            <CardHeader sx={{ padding: '10px 10px 0px 10px' }}
                avatar={
                    <div style={{ margin: '0px 0px 0px 20px' }}>
                        <Avatar className='piloticon' src={selectedTrack.getIconUrl()} />
                    </div>
                }
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ActivityIcon track={selectedTrack} size={23} />
                        <Typography variant='h6' style={{ paddingLeft: '5px' }}>{selectedTrack.pilotname}</Typography>
                    </div>
                }
                subheader={
                    <div>
                        <Typography variant='body2' color='text.secondary'>
                            {selectedTrack.area}
                        </Typography>
                    </div>
                } />
            <ExpandStatsButton expanded={expanded} setExpanded={setExpanded} />
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent id='track-playback-stats-content'>
                    <TrackPlaybackStatsTable playbackState={playbackState} />
                </CardContent>
            </Collapse>
        </Card>
    )
}