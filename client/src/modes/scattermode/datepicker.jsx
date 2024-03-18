import React from 'react';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { loadTracks } from './trackloader';
import { TrackGroupSelection } from './trackGroupSelection';
import { TrackPoint } from './trackpoint';
import { AdvancedSearchDialog } from './advancedsearchdialog';
import * as CesiumMap from '../../cesiummap';
import './datepicker.css';

export const DatePicker = ({ state, setState, scatterState, setScatterState }) => {
    const [showAdvancedSearchDialog, setShowAdvancedSearchDialog] = React.useState(false);

    React.useEffect(() => {
        if (state.tracks.length === 0) {
            loadTracks(state, setState, scatterState, setScatterState);
        }
    }, []);

    const handleSearchConditionChange = React.useCallback((newSearchCondition) => {
        CesiumMap.removeAllEntities();
        loadTracks(state, setState, {
            ...scatterState,
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
            searchCondition: newSearchCondition,
        }, setScatterState);
    }, [state, scatterState]);

    const handleDateChange = React.useCallback((newDate) => {
        const date = dayjs(newDate);
        const copySearchCondition = scatterState.searchCondition;
        copySearchCondition.from = date.startOf('day');
        copySearchCondition.to = date.endOf('day');
        handleSearchConditionChange(copySearchCondition);
    }, [state, scatterState]);

    const handleAdvancedSearchIconClick = React.useCallback(() => {
        setShowAdvancedSearchDialog(true);
    });

    return (
        <div id='date-picker-container'>
            <DesktopDatePicker
                defaultValue={scatterState.searchCondition.from}
                format="YYYY-MM-DD (ddd)"
                onChange={handleDateChange} />
            <AddCircleOutlineIcon
                id='advanced-search'
                color='primary'
                onClick={handleAdvancedSearchIconClick} />
            <AdvancedSearchDialog
                scatterState={scatterState}
                show={showAdvancedSearchDialog}
                setShow={setShowAdvancedSearchDialog}
                search={handleSearchConditionChange} />
        </div>
    );
}