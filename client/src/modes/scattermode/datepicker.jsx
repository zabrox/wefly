import React from 'react';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { loadTracks } from './trackloader';
import { TrackGroupSelection } from './trackGroupSelection';
import { AdvancedSearchDialog } from './advancedsearchdialog';
import * as CesiumMap from '../../cesiummap';
import './datepicker.css';
import { SearchCondition } from './searchcondition';

export const DatePicker = ({ state, setState, scatterState, setScatterState }) => {
    const [showAdvancedSearchDialog, setShowAdvancedSearchDialog] = React.useState(false);

    React.useEffect(() => {
        if (state.tracks.length === 0) {
            loadTracks(state, setState, scatterState, setScatterState);
        }
    }, []);

    const handleDateChange = React.useCallback((newDate) => {
        CesiumMap.removeAllEntities();
        const date = dayjs(newDate);
        const copySearchCondition = scatterState.searchCondition;
        copySearchCondition.from = date;
        copySearchCondition.to = date;
        loadTracks(state, setState, {
            ...scatterState,
            selectedTrackGroups: new TrackGroupSelection(),
            searchCondition: copySearchCondition,
        }, setScatterState);
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
                setShow={setShowAdvancedSearchDialog} />
        </div>
    );
}