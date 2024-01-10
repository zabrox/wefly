import { TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { TrackFilter } from './trackfilter';

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

export const Headers = [
    {
        id: 'activity',
        label: 'Activity',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'activity'),
        display: (track) => (track.activity),
    },
    {
        id: 'pilotname',
        label: 'Pilot',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'pilotname'),
        display: (track) => (track.pilotname),
    },
    {
        id: 'area',
        label: 'Area',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'area'),
        display: (track) => (cutDownAreaName(track.area)),
    },
    {
        id: 'starttime',
        label: 'Start',
        numeric: false,
        defaultOrder: 'asc',
        comparator: compareByKey.bind(null, 'startTime'),
        display: (track) => (track.startTime().split(' ')[1]),
    },
    {
        id: 'duration',
        label: 'Duration',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'duration'),
        display: (track) => (track.durationStr()),
    },
    {
        id: 'maxalt',
        label: 'Max Alt.',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'maxAltitude'),
        display: (track) => (`${track.maxAltitude()}m`),
    },
    {
        id: 'distance',
        label: 'Distance',
        numeric: true,
        defaultOrder: 'desc',
        comparator: compareByKey.bind(null, 'distance'),
        display: (track) => (`${track.distance}km`),
    },
];

export const TrackListHeader = ({ tracks, order, setOrder, orderBy, setOrderBy, filter, setFilter }) => {

    const handleSort = (property) => {
        const isAcsc = orderBy === property && order === 'asc';
        setOrder(isAcsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <TableHead>
            <TableRow id="track-list-header">
                {Headers.map((header) => (
                    <TableCell
                        key={header.id}
                        sortDirection={orderBy === header.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === header.id}
                            direction={orderBy === header.id ? order : 'asc'}
                            onClick={() => handleSort(header.id)}
                        >
                            {header.label}
                            {['area', 'pilotname', 'activity'].includes(header.id) && (
                                <TrackFilter
                                    tracks={tracks}
                                    filterkey={header.id}
                                    filter={filter}
                                    setFilter={setFilter} />)}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};