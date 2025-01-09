import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { headers } from './tracklistheader';
import { trackColor } from '../../../../util/trackcolor';
import { PilotIcon } from '../../../../util/piloticon';

const TrackListItem = ({ track, selected, onClick }) => {
    console.log(track.pilotname);
    return (
        <ListItem
            button
            onClick={onClick}
            style={{
                backgroundColor: selected ? trackColor(track).withAlpha(0.6).toCssHexString() : '',
            }}
        >
            <ListItemIcon>
                <PilotIcon track={track} size={32} />
            </ListItemIcon>
            <ListItemText
                primary={`${track.metadata.pilotname} / ${track.metadata.area}`}
                secondary={
                    <>
                        <div>{track.metadata.startTime.format('YY-MM-DD HH:mm')} / {track.metadata.durationString()}</div>
                        <div>{`${track.metadata.maxAltitude}m / ${track.metadata.distance}km / ${track.metadata.model}`}</div>
                    </>
                }
            />
        </ListItem>
    );
};

export const TrackList = ({ state, scatterState, onTrackClicked }) => {
    const tracksInPerspective = [...scatterState.tracksInPerspective];
    scatterState.trackGroupsInPerspective.forEach(trackGroup => {
        trackGroup.trackIds.forEach(trackId => {
            if (tracksInPerspective.find(t => t.getId() === trackId)) {
                return;
            }
            const track = state.tracks.find(track => track.getId() === trackId);
            if (track) {
                tracksInPerspective.push(track);
            }
        });
    });
    const sortedTracks = React.useMemo(() => {
            const comparator = headers.find(header => header.id === scatterState.orderBy).comparator;
            const sortedTracks = tracksInPerspective.slice().sort(comparator);
            return scatterState.order === 'asc' ? sortedTracks : sortedTracks.reverse();
        }, [scatterState]);

    return (
        <List>
            {sortedTracks.map((track, i) => (
                <TrackListItem
                    key={track.getId()}
                    track={track}
                    selected={scatterState.selectedTracks.has(track.getId())}
                    onClick={() => onTrackClicked(track.getId())}
                />
            ))}
        </List>
    );
};
