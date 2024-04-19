import * as React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ActivityIcon } from '../../../util/activityicon';
import { PilotIcon } from '../../../util/piloticon';
import { TrackPoint } from '../trackpoint';
import { TrackPointStatsTable } from './trackpointstatstable';
import './trackpointstatsoverlay.css';

const ExpandStatsButton = ({ expanded, onExpand }) => {
    const style = {
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    };

    return (
        <ExpandMoreIcon
            id='track-point-expand-stats'
            style={style}
            onClick={onExpand} />
    );
}

export const TrackPointStatsOverlay = ({ scatterState, setScatterState }) => {
    if (scatterState.selectedTrackPoint === undefined) return null;

    const [expanded, setExpanded] = React.useState(true);
    const handleExpand = () => {
        setExpanded(!expanded);
    }
    const handleVisibilityChange = React.useCallback((e) => {
        const copySelectedTracks = new Set(scatterState.selectedTracks);
        copySelectedTracks.delete(scatterState.selectedTrackPoint.track.getId());
        setScatterState(scatterState => ({ ...scatterState, selectedTracks: copySelectedTracks, selectedTrackPoint: new TrackPoint() }));
        e.stopPropagation();
    });

    const selectedTrack = scatterState.selectedTrackPoint.track;
    if (selectedTrack === undefined) {
        return null;
    }

    return (
        <Card id='track-point-stats-overlay'>
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
                        <VisibilityOffIcon style={{ marginLeft: 'auto', marginRight: '20px' }} onClick={handleVisibilityChange} />
                        <ExpandStatsButton expanded={expanded} onExpand={handleExpand} />
                    </div>
                }
                subheader={
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography variant='body2' color='text.secondary'>
                            {selectedTrack.metadata.area}
                        </Typography>
                        {selectedTrack.metadata.model !== '' &&
                            <Typography variant='subtitle2' color='text.secondary'>
                                {`　${selectedTrack.metadata.model}`}
                            </Typography>
                        }
                    </div>
                } />
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                <CardContent id='track-point-stats-content'>
                    <TrackPointStatsTable trackPoint={scatterState.selectedTrackPoint} />
                </CardContent>
            </Collapse>
        </Card>
    )
}