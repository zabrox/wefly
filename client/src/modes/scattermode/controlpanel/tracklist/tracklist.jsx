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

const MAX_AREA_NAME_LENGTH = 17;
const cutDownAreaName = (area) => {
    if (area === undefined) {
        return '';
    }
    if (area.length > MAX_AREA_NAME_LENGTH) {
        return area.slice(0, MAX_AREA_NAME_LENGTH) + '...';
    }
    return area;
}

export const headers = [
    {
        id: 'activity',
        label: '',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'activity'),
        display: (track) => <ActivityIcon track={track} size={32} />,
    },
    {
        id: 'pilotname',
        label: 'パイロット',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'pilotname'),
        display: (track) => {
            return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PilotIcon track={track} />
                    {track.metadata.pilotname}
                </div>
            );
        }
    },
    {
        id: 'area',
        label: 'エリア',
        numeric: false,
        defaultOrder: 'asc',
        comparator: ((track1, track2) => {
            const area1 = track1.metadata.area;
            const area2 = track2.metadata.area;
            return area1.localeCompare(area2);
        }),
        display: (track) => (cutDownAreaName(track.metadata.area)),
    },
    {
        id: 'starttime',
        label: '開始時刻',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'startTime'),
        display: (track) => (track.metadata.startTime.format('YY-MM-DD HH:mm')),
    },
    {
        id: 'duration',
        label: '飛行時間',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'duration'),
        display: (track) => (track.metadata.durationString()),
    },
    {
        id: 'maxalt',
        label: '最高高度',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'maxAltitude'),
        display: (track) => (`${track.metadata.maxAltitude}m`),
    },
    {
        id: 'distance',
        label: '距離',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'distance'),
        display: (track) => (`${track.metadata.distance}km`),
    },
    {
        id: 'model',
        label: '機体',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'model'),
        display: (track) => (track.metadata.model),
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
                    onClick={() => onTrackClicked(track.getId())}
                />
            ))}
        </List>
    );
};
