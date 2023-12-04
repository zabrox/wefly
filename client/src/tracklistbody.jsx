import React from 'react';
import { TableBody, TableRow, TableCell } from '@mui/material';
import { Headers } from './tracklistheader';

const filterTracksByArea = (tracks, areasFilter) => {
    if (areasFilter.length === 0) {
        return tracks;
    }
    return tracks.filter(track => 'area' in track && areasFilter.includes(track.area));
};

const TrackCell = ({ track, header }) => {
    return (<TableCell className={header.id}>{header.display(track)}</TableCell>);
}

const mapTracksToTableRows = (tracks, onTrackClicked) => {
    return tracks.map((track, i) => (
        <TableRow
            key={"tr" + i}
            id={`trackrow-${track.id}`}
            onClick={() => { onTrackClicked(track.id) }}
            style={{
                backgroundColor: track.isShowingTrackLine() ? track.color.toCssHexString() : '',
                scrollMarginTop: document.getElementById('track-list-header').clientHeight,
            }}>{
                Headers.map((header) => (
                    <TrackCell key={track.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const TrackListBody = ({ tracks, onTrackClicked, orderBy, order, areasFilter }) => {
    const sortedrows = React.useMemo(() => {
        const comparator = Headers.find(header => header.id === orderBy).comparator;
        const sortedTracks = tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });

    return (
        <TableBody>{
            mapTracksToTableRows(
                filterTracksByArea(sortedrows, areasFilter),
                onTrackClicked,
            )
        }</TableBody>
    );
}
