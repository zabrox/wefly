import React from 'react';
import { TableBody, TableRow, TableCell } from '@mui/material';
import { headers } from './tracklistheader';
import { trackColor } from '../../util/trackcolor';

const TrackCell = ({ track, header }) => {
    let style = {};
    if (header.id === 'activity') {
        style = {
            textAlign: 'center',
        };
    }
    return (<TableCell style={style} className={header.id}>{header.display(track)}</TableCell>);
}

const mapTracksToTableRows = (tracks, selectedTracks, onTrackClicked) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.getId()}`}
            onClick={() => { onTrackClicked(track.getId()) }}
            style={{
                backgroundColor: selectedTracks.has(track.getId()) ? trackColor(track).withAlpha(0.6).toCssHexString() : '',
            }}>{
                headers.map((header) => (
                    <TrackCell key={track.metadata.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const TrackListBody = ({ state, scatterState, onTrackClicked }) => {
    const sortedTracks = React.useMemo(() => {
        const comparator = headers.find(header => header.id === scatterState.orderBy).comparator;
        const sortedTracks = state.tracks.slice().sort(comparator);
        return scatterState.order === 'asc' ? sortedTracks : sortedTracks.reverse();
    }, [state, scatterState]);

    const unfilteredTracks = scatterState.selectedTrackGroups.filterTracks(sortedTracks); 

    return (
        <TableBody id='track-list-body'>{
            mapTracksToTableRows(unfilteredTracks, scatterState.selectedTracks, onTrackClicked)
        }</TableBody>
    );
}
