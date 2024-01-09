import React from 'react';
import { TableBody, TableRow, TableCell } from '@mui/material';
import { Headers } from './tracklistheader';

const filterTracks = (tracks, areasFilter, pilotsFilter, activitiesFilter) => {
    let filteredTracks = tracks;
    if (areasFilter.length > 0) {
        filteredTracks = filteredTracks.filter(track => 'area' in track && areasFilter.includes(track.area))
    }
    if (pilotsFilter.length > 0) {
        filteredTracks = filteredTracks.filter(track => 'pilotname' in track && pilotsFilter.includes(track.pilotname))
    }
    if (activitiesFilter.length > 0) {
        filteredTracks = filteredTracks.filter(track => 'activity' in track && activitiesFilter.includes(track.activity));
    }
    return filteredTracks;
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
                backgroundColor: track.isShowingTrackLine() ? track.color.withAlpha(0.6).toCssHexString() : '',
            }}>{
                Headers.map((header) => (
                    <TrackCell key={track.pilotname + header.id} track={track} header={header} />
                ))
            }
        </TableRow>
    ));
};

export const TrackListBody = ({ tracks, onTrackClicked, orderBy, order, areasFilter, pilotsFilter, activitiesFilter }) => {
    const sortedrows = React.useMemo(() => {
        const comparator = Headers.find(header => header.id === orderBy).comparator;
        const sortedTracks = tracks.slice().sort(comparator);
        return order === 'asc' ? sortedTracks : sortedTracks.reverse();
    });

    return (
        <TableBody>{
            mapTracksToTableRows(
                filterTracks(sortedrows, areasFilter, pilotsFilter, activitiesFilter),
                onTrackClicked,
            )
        }</TableBody>
    );
}
