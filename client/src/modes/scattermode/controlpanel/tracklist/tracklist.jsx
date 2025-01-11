import React from 'react';
import { List } from '@mui/material';
import TrackListItem from './tracklistitem';
import { headers } from './tracklistsortdialog';

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
                    index={i}
                    onClick={() => onTrackClicked(track.getId())}
                />
            ))}
        </List>
    );
};
