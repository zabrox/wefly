import React from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogTitle, TextField, Grid, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { SearchCondition } from './searchcondition';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';
import './advancedsearchdialog.css';

export const AdvancedSearchDialog = ({ scatterState, show, setShow, search }) => {
    const [searchCondition, setSearchCondition] = React.useState(new SearchCondition(scatterState.searchCondition));

    const handleCancelClick = () => {
        setShow(false);
    }
    const handleSearchClick = React.useCallback(() => {
        setShow(false);
        search(searchCondition);
    }, [scatterState, searchCondition, search]);
    const handleFromDateChange = React.useCallback((newDate) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.from = dayjs(newDate).startOf('day');
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);
    const handleToDateChange = React.useCallback((newDate) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.to = dayjs(newDate).endOf('day');
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);
    const handlePilotnameChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.pilotname = e.target.value;
        console.log(copySearchCondition)
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);
    const handleMaxAltChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.maxAltitude = e.target.value === '' ? undefined : e.target.value;
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);
    const handleDistanceChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.distance = e.target.value === '' ? undefined : e.target.value;
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);
    const handleDurationChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.duration = e.target.value === '' ? undefined : e.target.value;
        setSearchCondition(copySearchCondition);
    }, [scatterState, searchCondition]);

    return (
        <Dialog open={show} >
            <DialogTitle>高度な検索</DialogTitle>
            <DialogContent id='advanced-search-dialog-content'>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <DesktopDatePicker
                            label="From"
                            defaultValue={scatterState.searchCondition.from}
                            format="YYYY-MM-DD (ddd)"
                            onChange={handleFromDateChange} />
                    </Grid>
                    <Grid item>
                        <DesktopDatePicker
                            label="To"
                            defaultValue={scatterState.searchCondition.to}
                            format="YYYY-MM-DD (ddd)"
                            onChange={handleToDateChange} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="パイロット名"
                            onChange={handlePilotnameChange}
                            defaultValue={searchCondition.pilotname} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="最高高度≧ (m)"
                            type="number"
                            onChange={handleMaxAltChange}
                            defaultValue={searchCondition.maxAltitude} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="距離≧ (km)"
                            type="number"
                            onChange={handleDistanceChange}
                            defaultValue={searchCondition.distance} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="飛行時間≧ (分)"
                            type="number"
                            onChange={handleDurationChange}
                            defaultValue={searchCondition.duration} />
                    </Grid>
                    <Grid item>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item>
                                <Button variant="contained" onClick={handleSearchClick}>検索</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" onClick={handleCancelClick}>キャンセル</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
