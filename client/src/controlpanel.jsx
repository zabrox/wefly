import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { Checkbox } from '@mui/material';
import './controlpanel.css';
import { Tab } from '@mui/material';

export const ControlPanel = (props) => {
    return (
        <div className="control-panel">
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>Pilot</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Max Alt.</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> {
                        props.tracks.map((track, i) => {
                            return (
                                <TableRow key={"tr" + i}>
                                    <TableCell>
                                        <Checkbox color="primary" checked={track.show} onChange={() => props.onChange(track.id)} />
                                    </TableCell>
                                    <TableCell key={"track-color-td" + i}>
                                        <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                    </TableCell>
                                    <TableCell className="pilotname" key={track.pilotname}>{track.pilotname}</TableCell>
                                    <TableCell className="starttime" key={track.pilotname + "starttime"}>{track.startTime()}</TableCell>
                                    <TableCell className="duration" key={track.pilotname + "duration"}>{track.duration()}</TableCell>
                                    <TableCell className="maxalt" key={track.pilotname + "maxalt"}>{track.maxAltitude()}m</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
};