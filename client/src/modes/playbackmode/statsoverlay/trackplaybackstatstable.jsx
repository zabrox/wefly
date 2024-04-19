import * as React from 'react';
import { Table, TableRow, TableCell, TableBody } from '@mui/material';
import { TrackStatsCalculator } from '../../../entities/trackstatscalculator';
import './trackplaybackstatstable.css';

export const TrackPlaybackStatsTable = ({ playbackState }) => {
    if (playbackState.selectedTrack === undefined) return null;
    const currentTime = playbackState.currentTime;

    const stats = new TrackStatsCalculator(playbackState.selectedTrack);
    const duration = stats.duration(currentTime).format('HH:mm:ss');
    const altitude = stats.getAverageAltitude(currentTime.add(-1, 'seconds'), currentTime);
    const speed = stats.getAverageSpeed(currentTime.add(-3, 'seconds'), currentTime);
    const gain = stats.getAverageGain(currentTime.add(-3, 'seconds'), currentTime);
    const glideRatio = stats.getAverageGlideRatio(currentTime.add(-3, 'seconds'), currentTime);
    const distance = stats.getDistance(currentTime);
    const totalDistance = stats.getTotalDistance(currentTime);

    return (
        <div id='track-playback-stats-table'>
            <Table id='track-playback-stats-table1' size='small'>
                <TableBody>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>時刻</b></TableCell>
                        <TableCell>{currentTime.format('HH:mm:ss')}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>高度</b></TableCell>
                        <TableCell>{altitude !== undefined ? `${parseInt(altitude)} m` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>上昇率</b></TableCell>
                        <TableCell>{gain !== undefined ? `${gain.toFixed(1)} m/s` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>距離</b></TableCell>
                        <TableCell>{distance !== undefined ? `${distance.toFixed(1)} km` : '---'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table id='track-playback-stats-table2' size='small'>
                <TableBody>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>飛行時間</b></TableCell>
                        <TableCell>{duration}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>速度</b></TableCell>
                        <TableCell>{speed !== undefined ? `${parseInt(speed)} km/h` : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>滑空比</b></TableCell>
                        <TableCell>{glideRatio !== undefined ? glideRatio.toFixed(1) : '---'}</TableCell>
                    </TableRow>
                    <TableRow sx={{ padding: 0 }}>
                        <TableCell><b>累計距離</b></TableCell>
                        <TableCell>{distance !== undefined ? `${totalDistance.toFixed(1)} km` : '---'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}