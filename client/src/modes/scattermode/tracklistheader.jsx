import React from 'react';
import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { ActivityIcon } from '../../util/activityicon';
import { PilotIcon } from '../../util/piloticon';
import './tracklistheader.css';

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
        id: 'model',
        label: '機体',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'model'),
        display: (track) => (track.metadata.model),
    },
    {
        id: 'area',
        label: 'エリア',
        numeric: false,
        defaultOrder: 'asc',
        comparator: ((track1, track2) => {
            const area1 = track1.metadata.area.areaName;
            const area2 = track2.metadata.area.areaName;
            return area1.localeCompare(area2);
        }),
        display: (track) => (cutDownAreaName(track.metadata.area.areaName)),
    },
    {
        id: 'starttime',
        label: '開始時刻',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'startTime'),
        display: (track) => (track.metadata.startTime.format('HH:mm:ss')),
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
];

export const TrackListHeader = ({ scatterState, setScatterState }) => {

    const handleSort = React.useCallback((property) => {
        let order = false;
        if (scatterState.orderBy === property) {
            order = scatterState.order == 'asc' ? 'desc' : 'asc';
        } else {
            order = headers.find(header => header.id === property).defaultOrder;
        }
        setScatterState({ ...scatterState, orderBy: property, order: order })
    }, [scatterState]);

    return (
        <TableHead>
            <TableRow id="track-list-header">
                {headers.map((header) => (
                    <TableCell
                        className={header.id}
                        key={header.id}
                        sortDirection={scatterState.orderBy === header.id ? scatterState.order : false}
                    >
                        <TableSortLabel
                            active={scatterState.orderBy === header.id}
                            direction={scatterState.orderBy === header.id ? scatterState.order : 'asc'}
                            onClick={() => handleSort(header.id, headers)}
                        >
                            <div className='label-text'>{header.label}</div>
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};