import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { judgeMedia } from '../../../util/media';

export const AdvancedSearchCondition = ({ searchCondition }) => {
    const variant = judgeMedia().isMobile ? 'caption' : 'body2';
    return (
        <Box style={{ width: '80%' }}>
            <Grid container id='advanced-search-condition' spacing={1} columnSpacing={{ md: 2, sm: 1, xs: 1 }}>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>From:</b> {searchCondition.from.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>To:</b> {searchCondition.to.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>パイロット:</b> {searchCondition.pilotname === '' ? '---' : searchCondition.pilotname}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>最高高度:</b> {!searchCondition.maxAltitude ? '---' : searchCondition.maxAltitude}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行距離:</b> {!searchCondition.distance ? '---' : searchCondition.distance}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行時間:</b> {!searchCondition.duration ? '---' : searchCondition.duration}</Typography>
                </Grid>
            </Grid >
        </Box >
    );
}