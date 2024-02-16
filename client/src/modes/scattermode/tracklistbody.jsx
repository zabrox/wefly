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

const mapTracksToTableRows = (tracks, onTrackClicked) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { onTrackClicked(track.id) }}
            style={{
                // backgroundColor: track.isSelected() ? trackColor(track).withAlpha(0.6).toCssHexString() : '',
            }}>{
                headers.map((header) => (
                    <TrackCell key={track.metadata.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const TrackListBody = ({ tracks, onTrackClicked, orderBy, order, filter }) => {
    const sortedrows = React.useMemo(() => {
        const comparator = headers.find(header => header.id === orderBy).comparator;
        const sortedTracks = tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });

    const unfilteredTracks = filter.filterTracks(sortedrows);

    return (
        <TableBody id='track-list-body'>{
            mapTracksToTableRows(unfilteredTracks, onTrackClicked)
        }</TableBody>
    );
}
