import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import dayjs from 'dayjs';
import { Metadata } from '../../entities/metadata';
import { TrackGroup } from '../../entities/trackgroup';

vi.mock('axios');

import { loadTrackGroups, loadMetadatas, loadPaths } from './trackloader';
import axios from 'axios';

describe('TrackLoader', () => {
    beforeEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    describe('loadTrackGroups', () => {
        it('loads track groups successfully', async () => {
            const date = dayjs('2022-01-01');
            const trackgroupsurl = `${import.meta.env.VITE_API_URL}/trackgroups?date=`;
            const response = {
                data: [
                    { groupid: 1, position: [137.111, 35.234], trackIds: ['Takase_20240303120000'] },
                    { groupid: 2, position: [138.111, 36.234], trackIds: ['Hirayama_20240303120000'] },
                ],
            };
            axios.mockResolvedValueOnce(response);

            const trackGroups = await loadTrackGroups(date);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${trackgroupsurl}${date.format('YYYY-MM-DD')}`,
                responseType: 'json',
            });
            expect(trackGroups).toEqual([
                new TrackGroup(1, [137.111, 35.234], ['Takase_20240303120000']),
                new TrackGroup(2, [138.111, 36.234], ['Hirayama_20240303120000']),
            ]);
        });

        it('throws an error when loading track groups fails', async () => {
            const date = dayjs('2022-01-01');
            const trackgroupsurl = `${import.meta.env.VITE_API_URL}/trackgroups?date=`;
            const error = new Error('Failed to load track groups');
            axios.mockRejectedValueOnce(error);

            await expect(loadTrackGroups(date)).rejects.toThrow(error);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${trackgroupsurl}${date.format('YYYY-MM-DD')}`,
                responseType: 'json',
            });
        });
    });

    describe('loadMetadatas', () => {
        it('loads metadatas successfully', async () => {
            const date = dayjs('2022-01-01');
            const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata?date=`;
            const metadata1 = Metadata.deserialize({ pilotname: 'Takase', distance: 123, duration: 60, area: 'Asagiri' });
            const metadata2 = Metadata.deserialize({ pilotname: 'Hirayama', distance: 2, duration: 3, area: 'Ongata' });
            const response = {
                data: [
                    { ...metadata1 },
                    { ...metadata2 },
                ],
            };
            axios.mockResolvedValueOnce(response);

            const metadatas = await loadMetadatas(date);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${metadatasurl}${date.format('YYYY-MM-DD')}`,
                responseType: 'json',
            });
            expect(metadatas).toEqual([
                metadata1,
                metadata2,
            ]);
        });

        it('throws an error when loading metadatas fails', async () => {
            const date = dayjs('2022-01-01');
            const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata?date=`;
            const error = new Error('Failed to load metadatas');
            axios.mockRejectedValueOnce(error);

            await expect(loadMetadatas(date)).rejects.toThrow(error);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${metadatasurl}${date.format('YYYY-MM-DD')}`,
                responseType: 'json',
            });
        });
    });

    describe('loadPaths', () => {
        it('loads paths successfully', async () => {
            const trackId1 = 'Takase_20240303120000';
            const trackId2 = 'Hierayama_20240303120000';
            const tracks = [
                { getId: () => trackId1, path: { addPoint: vi.fn() } },
                { getId: () => trackId2, path: { addPoint: vi.fn() } },
            ];
            const pathsurl = `${import.meta.env.VITE_API_URL}/tracks/paths?trackids=`;
            const response = {
                data: {
                    Takase_20240303120000: [
                        [137.5, 35.8, 300, '2022-01-01T00:00:01Z'],
                        [137.5, 35.8, 300, '2022-01-01T00:00:02Z'],
                        [137.5, 35.8, 300, '2022-01-01T00:00:03Z'],
                    ],
                    Hierayama_20240303120000: [
                        [137.5, 35.8, 300, '2022-01-01T00:00:01Z'],
                        [137.5, 35.8, 300, '2022-01-01T00:00:02Z'],
                        [137.5, 35.8, 300, '2022-01-01T00:00:03Z'],
                    ],
                },
            };
            axios.mockResolvedValueOnce(response);

            await loadPaths(tracks);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${pathsurl}${trackId1},${trackId2}`,
                responseType: 'json',
            });
            expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:01Z'));
            expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:02Z'));
            expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:03Z'));
            expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:01Z'));
            expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:02Z'));
            expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:03Z'));
        });

        it('throws an error when loading paths fails', async () => {
            const tracks = [
                { getId: () => '1', path: { addPoint: vi.fn() } },
                { getId: () => '2', path: { addPoint: vi.fn() } },
            ];
            const pathsurl = `${import.meta.env.VITE_API_URL}/tracks/paths?trackids=`;
            const error = new Error('Failed to load paths');
            axios.mockRejectedValueOnce(error);

            await expect(loadPaths(tracks)).rejects.toThrow(error);

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: `${pathsurl}1,2`,
                responseType: 'json',
            });
            expect(tracks[0].path.addPoint).not.toHaveBeenCalled();
            expect(tracks[1].path.addPoint).not.toHaveBeenCalled();
        });
    });
});