import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { TrackFilter } from './trackfilter';
import { ActivityIcon } from './activityicon';
import './tracklistheader.css';

const compareByKey = (key, a, b) => {
    const valueA = typeof a[key] === 'function' ? a[key]() : a[key];
    const valueB = typeof b[key] === 'function' ? b[key]() : b[key];
    if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB);
    }
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
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
        display: (track) => <ActivityIcon track={track} />,
    },
    {
        id: 'pilotname',
        label: 'パイロット',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'pilotname'),
        display: (track) => {
            return (
                <div>
                    <img className='piloticon' src={track.getIconUrl()} />
                    {track.pilotname}
                </div>
            );
        }
    },
    {
        id: 'area',
        label: 'エリア',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'area'),
        display: (track) => (cutDownAreaName(track.area)),
    },
    {
        id: 'starttime',
        label: '開始時刻',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'startTime'),
        display: (track) => (track.startTime().split(' ')[1]),
    },
    {
        id: 'duration',
        label: '飛行時間',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'duration'),
        display: (track) => (track.durationStr()),
    },
    {
        id: 'maxalt',
        label: '最高高度',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'maxAltitude'),
        display: (track) => (`${track.maxAltitude()}m`),
    },
    {
        id: 'distance',
        label: '距離',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'distance'),
        display: (track) => (`${track.distance}km`),
    },
];

export const TrackListHeader = ({ tracks, scatterState, setScatterState }) => {

    const handleSort = (property) => {
        let order = false;
        if (scatterState.orderBy === property) {
            order = scatterState.order == 'asc' ? 'desc' : 'asc';
        } else {
            order = headers.find(header => header.id === property).defaultOrder;
        }
        setScatterState({ ...scatterState, orderBy: property, order: order })
    };

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
                            {['area', 'pilotname', 'activity'].includes(header.id) && (
                                <TrackFilter
                                    tracks={tracks}
                                    filterkey={header.id}
                                    filter={scatterState.filter}
                                    setFilter={(filter) => setScatterState({ ...scatterState, filter: filter })} />)}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};