import * as React from 'react';
import dayjs from 'dayjs';
import { Table, TableRow, TableCell, TableBody } from '@mui/material';
import { TrackStatsCalculator } from '../../../entities/trackstatscalculator';
import './trackpointstatstable.css';

export const TrackPointStatsTable = ({ trackPoint }) => {
    const [stats, setStats] = React.useState({
        currentTime: dayjs(),
        duration: undefined,
        altitude: undefined,
        speed: undefined,
        gain: undefined,
        glideRatio: undefined,
        distance: undefined,
        totalDistance: undefined,
    });

    React.useEffect(() => {
        const copyStats = {...stats};
        const currentTime = trackPoint.track.path.times[trackPoint.index];
        copyStats.currentTime = currentTime;
        const calculator = new TrackStatsCalculator(trackPoint.track);
        copyStats.duration = calculator.duration(currentTime).format('HH:mm:ss');
        copyStats.altitude = calculator.getAverageAltitude(currentTime.add(-1, 'seconds'), currentTime);
        copyStats.speed = calculator.getAverageSpeed(currentTime.add(-3, 'seconds'), currentTime);
        copyStats.gain = calculator.getAverageGain(currentTime.add(-3, 'seconds'), currentTime);
        copyStats.glideRatio = calculator.getAverageGlideRatio(currentTime.add(-3, 'seconds'), currentTime);
        copyStats.distance = calculator.getDistance(currentTime);
        copyStats.totalDistance = calculator.getTotalDistance(currentTime);
        setStats(copyStats);
    }, [trackPoint]);

    return (
        <div id='track-point-stats-table'>
            <Table id='track-point-stats-table1' size='small'>
                <TableBody>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>時刻</b></TableCell>
                        <TableCell>{stats.currentTime.format('HH:mm:ss')}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>高度</b></TableCell>
                        <TableCell>{stats.altitude !== undefined ? `${parseInt(stats.altitude)} m` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>上昇率</b></TableCell>
                        <TableCell>{stats.gain !== undefined ? `${stats.gain.toFixed(1)} m/s` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>距離</b></TableCell>
                        <TableCell>{stats.distance !== undefined ? `${stats.distance.toFixed(1)} km` : '---'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table id='track-point-stats-table2' size='small'>
                <TableBody>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>飛行時間</b></TableCell>
                        <TableCell>{stats.duration}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>速度</b></TableCell>
                        <TableCell>{stats.speed !== undefined ? `${parseInt(stats.speed)} km/h` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>滑空比</b></TableCell>
                        <TableCell>{stats.glideRatio !== undefined ? stats.glideRatio.toFixed(1) : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>累計距離</b></TableCell>
                        <TableCell>{stats.distance !== undefined ? `${stats.totalDistance.toFixed(1)} km` : '---'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}