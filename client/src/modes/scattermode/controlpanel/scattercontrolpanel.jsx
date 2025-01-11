import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { TrackPoint } from '../trackpoint';
import { ProgressBar } from '../../playbackmode/progressbar';
import { ScatterActionDial } from './scatteractiondial';
import * as CesiumMap from '../../../cesiummap';
import { ScatterMap } from '../map/scattermap';
import { SearchConditionDisplay } from './searchconditiondisplay';
import { TrackGroupSelection } from '../trackGroupSelection';
import { TrackMenu } from './trackmenu';
import { loadPaths } from '../trackloader';
import * as Mode from '../../mode';
import { TrackList } from './tracklist/tracklist';
import TrackListSortDialog from './tracklist/tracklistsortdialog';
import './scattercontrolpanel.css';

export const ScatterControlPanel = ({ state, setState, scatterState, setScatterState }) => {
    const [sortDialogOpen, setSortDialogOpen] = React.useState(false);

    const handleSortIconClick = () => {
        setSortDialogOpen(true);
    };

    const handleSortDialogClose = () => {
        setSortDialogOpen(false);
    };

    const handleTrackGroupClick = React.useCallback(async (groupid, trackGroups) => {
        const group = trackGroups.find(group => group.groupid === groupid);
        CesiumMap.zoomToTrackGroup(group);
        const copyTracks = [...state.tracks];
        const tracksInGroup = copyTracks.filter(track => group.trackIds.includes(track.getId()))
        if (scatterState.selectedTrackGroups.has(group)) {
            CesiumMap.zoomToTracks(tracksInGroup);
            return;
        }
        setScatterState(scatterState => { return { ...scatterState, loading: true } });
        try {
            await loadPaths(tracksInGroup);
        } catch (error) {
            console.error(error);
            setState(state => { return { ...state, errorMessage: 'トラックのロードに失敗しました。トラックの数が多すぎます。' } });
            setScatterState(scatterState => { return { ...scatterState, loading: false } });
            return;
        }
        setState(state => { return { ...state, tracks: copyTracks } });
        const copySelectedTrackGroups = new TrackGroupSelection(scatterState.selectedTrackGroups);
        copySelectedTrackGroups.add(group);
        setScatterState(state => { return { ...state, selectedTrackGroups: copySelectedTrackGroups, loading: false } });
        CesiumMap.zoomToTracks(tracksInGroup);
    }, [state, scatterState]);

    const toggleSelectionOfTrack = React.useCallback((trackid) => {
        const copySelectedTracks = new Set(scatterState.selectedTracks);
        let copySelectedTrackPoint = new TrackPoint(scatterState.selectedTrackPoint);
        const select = !copySelectedTracks.has(trackid);
        if (select) {
            copySelectedTracks.add(trackid);
        } else {
            copySelectedTracks.delete(trackid);
            if (copySelectedTrackPoint.isValid() && copySelectedTrackPoint.track.getId() == trackid) {
                copySelectedTrackPoint = new TrackPoint();
            }
        }
        setScatterState(state => {
            return { ...state, selectedTracks: copySelectedTracks, selectedTrackPoint: copySelectedTrackPoint }
        });
        return select;
    }, [state, scatterState]);

    const handleTrackPointClick = React.useCallback((trackid, index) => {
        if (!scatterState.selectedTracks.has(trackid)) {
            toggleSelectionOfTrack(trackid);
        }
        const track = state.tracks.find(track => track.getId() === trackid);
        setScatterState(state => {
            return { ...state, selectedTrackPoint: new TrackPoint(track, index) }
        });
    }, [state, scatterState]);

    const handleTrackClick = React.useCallback(async (trackid) => {
        console.debug('handleTrackClick');
        const select = toggleSelectionOfTrack(trackid);
        if (select) {
            const targetTrack = state.tracks.find(track => track.getId() === trackid)
            if (targetTrack.path.points.length === 0) {
                const groupid = state.trackGroups.find(group => group.trackIds.includes(trackid)).groupid;
                await handleTrackGroupClick(groupid, state.trackGroups);
            }
            setScatterState(state => {
                return { ...state, selectedTrackPoint: new TrackPoint(targetTrack, 0) }
            })
            CesiumMap.zoomToTracks([targetTrack]);
        }
    }, [state, scatterState]);

    const trackNumber = React.useCallback(() => {
        const trackIds = [];
        scatterState.trackGroupsInPerspective.forEach(trackGroup => trackIds.push(...trackGroup.trackIds));
        scatterState.tracksInPerspective.forEach(track => {
            if (!trackIds.find(id => id === track.getId())) {
                trackIds.push(track.getId())
            }
        });
        return trackIds.length;
    }, [state, scatterState]);

    if (state.mode !== Mode.SCATTER_MODE) {
        return null;
    }

    return (
        <div id='scatter-control-panel'>
            <Box id='search-condition-display-container'>
                <SearchConditionDisplay
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState} />
                <Box id='track-menu-container'>
                    <Box id='track-menu'>
                        <TrackMenu state={state} />
                        <IconButton onClick={handleSortIconClick}>
                            <SortIcon />
                        </IconButton>
                        <TrackListSortDialog open={sortDialogOpen} onClose={handleSortDialogClose} scatterState={scatterState} setScatterState={setScatterState} />
                    </Box>
                    <Typography id='tracknumber-label'>
                        {trackNumber()} tracks
                    </Typography>
                </Box>
            </Box>
            <Box id='tracklist-container'>
                <TrackList
                    state={state}
                    scatterState={scatterState}
                    onTrackClicked={handleTrackClick}
                />
                <ProgressBar show={scatterState.loading} controlPanelSize={state.controlPanelSize} />
            </Box>
            <ScatterActionDial
                state={state}
                setState={setState}
                scatterState={scatterState} />
            <ScatterMap
                onTrackPointClick={handleTrackPointClick}
                onTrackGroupClick={handleTrackGroupClick}
                state={state}
                scatterState={scatterState}
                setScatterState={setScatterState} />
        </div >
    );
};