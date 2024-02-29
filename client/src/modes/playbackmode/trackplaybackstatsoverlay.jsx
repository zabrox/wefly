import * as React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ActivityIcon } from '../../util/activityicon';
import { TrackPlaybackStatsTable } from './trackplaybackstatstable';
import { PilotIcon } from '../../util/piloticon';
import './trackplaybackstatsoverlay.css';

const ExpandStatsButton = ({ expanded, onExpand }) => {
    const style = {
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    return (
        <ExpandMoreIcon
            id='track-playback-expand-stats'
            style={style}
            onClick={onExpand} />
    );
}

export const TrackPlaybackStatsOverlay = ({ playbackState }) => {
    if (playbackState.selectedTrack === undefined) return null;

    const [expanded, setExpanded] = React.useState(true);
    const selectedTrack = playbackState.selectedTrack;
    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <Card id='track-playback-stats-overlay'>
            <CardHeader sx={{ padding: '10px 10px 0px 10px' }} onClick={handleExpand}
                avatar={
                    <div style={{ margin: '0px 0px 0px 20px' }}>
                        <PilotIcon track={selectedTrack} />
                    </div>
                }
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ActivityIcon track={selectedTrack} size={23} />
                        <Typography variant='h6' style={{ paddingLeft: '5px' }}>{selectedTrack.metadata.pilotname}</Typography>
                    </div>
                }
                subheader={
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography variant='body2' color='text.secondary'>
                            {selectedTrack.metadata.area.areaName}
                        </Typography>
                        {selectedTrack.metadata.model !== '' &&
                            <Typography variant='subtitle2' color='text.secondary'>
                                {`　${selectedTrack.metadata.model}`}
                            </Typography>
                        }
                    </div>
                } />
            <ExpandStatsButton expanded={expanded} onExpand={handleExpand} />
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent id='track-playback-stats-content'>
                    <TrackPlaybackStatsTable playbackState={playbackState} />
                </CardContent>
            </Collapse>
        </Card>
    )
}