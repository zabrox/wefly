import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogTitle, TextField, Grid, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { SearchCondition } from './searchcondition';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';
import './advancedsearchdialog.css';

export const AdvancedSearchDialog = ({ scatterState, show, setShow }) => {
    const [searchCondition, setSearchCondition] = React.useState({
        searchCondition: new SearchCondition(scatterState.searchCondition),
    });

    const handleCancelClick = () => {
        setShow(false);
    }
    const handleSearchClick = React.useCallback(() => {
        setShow(false);
    }, [searchCondition]);
    const handleFromDateChange = React.useCallback((newDate) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.from = dayjs(newDate);
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    const handleToDateChange = React.useCallback((newDate) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.to = dayjs(newDate);
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    const handlePilotnameChange = React.useCallback((e) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.pilotName = e.target.value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    const handleMaxAltChange = React.useCallback((e) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.maxAltitude = e.target.value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    const handleDistanceChange = React.useCallback((e) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.distance = e.target.value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    const handleDurationChange = React.useCallback((e) => {
        const copySearchCondition = searchCondition;
        copySearchCondition.duration = e.target.value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);

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
                        <ToggleButtonGroup
                            exclusive
                            aria-label="アクティビティ"
                        >
                            <ToggleButton value="Paraglider" aria-label="パラグライダー">
                                <img src={ParagliderIcon} />
                            </ToggleButton>
                            <ToggleButton value="Hangglider" aria-label="ハンググライダー">
                                <img src={HanggliderIcon} />
                            </ToggleButton>
                            <ToggleButton value="Glider" aria-label="グライダー">
                                <img src={GliderIcon} />
                            </ToggleButton>
                            <ToggleButton value="Other" aria-label="その他">
                                <QuestionMarkIcon sx={{ width: '32px', height: '32px' }} />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item>
                        <TextField label="パイロット名" onChange={handlePilotnameChange} />
                    </Grid>
                    <Grid item>
                        <TextField label="最高高度≧ (m)" type="number" onChange={handleMaxAltChange} />
                    </Grid>
                    <Grid item>
                        <TextField label="距離≧ (km)" type="number" onChange={handleDistanceChange} />
                    </Grid>
                    <Grid item>
                        <TextField label="飛行時間≧ (分)" type="number" onChange={handleDurationChange} />
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
