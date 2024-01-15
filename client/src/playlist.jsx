import { Table, TableHead, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';
import { focusOnTrack } from './playbackmap';
import './playlist.css';

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

const headers = [
    {
        id: 'activity',
        label: '種別',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.activity),
    },
    {
        id: 'pilotname',
        label: 'パイロット',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.pilotname),
    },
    {
        id: 'area',
        label: 'エリア',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (cutDownAreaName(track.area)),
    },
    {
        id: 'starttime',
        label: '開始時刻',
        numeric: false,
        defaultOrder: 'asc',
        display: (track) => (track.startTime().split(' ')[1]),
    },
];

const TrackCell = ({ track, header }) => {
    return (<TableCell className={header.id}>{header.display(track)}</TableCell>);
}

const mapTracksToTableRows = (tracks) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { focusOnTrack(track) }} >
            {
                headers.map((header) => (
                    <TrackCell key={track.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const PlayList = ({ state }) => {
    return (
        <TableContainer id='playlist-container'>
            <Table>
                <TableHead>
                    <TableRow id="playlist-header">
                        {headers.map((header) => (
                            <TableCell
                                key={header.id}
                            >
                                {header.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>{
                    mapTracksToTableRows(state.actionTargetTracks)
                }</TableBody>
            </Table>
        </TableContainer>
    );
};