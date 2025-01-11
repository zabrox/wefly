import React from 'react';
import { List } from '@mui/material';
import TrackListItem from './tracklistitem';

const compareByKey = (key, track1, track2) => {
    const value1 = typeof track1.metadata[key] === 'function' ? track1.metadata[key]() : track1.metadata[key];
    const value2 = typeof track2.metadata[key] === 'function' ? track2.metadata[key]() : track2.metadata[key];
    if (typeof value1 === 'string') {
        return value1.localeCompare(value2);
    }
    return value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
}

export const headers = [
    {
        id: 'activity',
        comparator: compareByKey.bind(null, 'activity'),
    },
    {
        id: 'pilotname',
        comparator: compareByKey.bind(null, 'pilotname'),
    },
    {
        id: 'area',
        comparator: ((track1, track2) => {
            const area1 = track1.metadata.area;
            const area2 = track2.metadata.area;
            return area1.localeCompare(area2);
        }),
    },
    {
        id: 'starttime',
        comparator: compareByKey.bind(null, 'startTime'),
    },
    {
        id: 'duration',
        comparator: compareByKey.bind(null, 'duration'),
    },
    {
        id: 'maxalt',
        comparator: compareByKey.bind(null, 'maxAltitude'),
    },
    {
        id: 'distance',
        comparator: compareByKey.bind(null, 'distance'),
    },
];

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
