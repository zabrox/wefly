import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { loadTakeoffLanding } from './takeofflandingloader';
import { Takeoff } from '../../../entities/takeoff';
import { Landing } from '../../../entities/landing';

vi.mock('axios');

describe('loadTakeoffLanding', () => {
    it('loads takeoffs and landings successfully', async () => {
        const setScatterState = vi.fn();
        const response = {
            data: {
                takeoffs: [
                    { name: 'Takeoff 1', organization: 'Organization 1', longitude: '111.111', latitude: '11.111', altitude: '1111', direction: '南' },
                    { name: 'Takeoff 2', organization: 'Organization 2', longitude: '222.222', latitude: '22.222', altitude: '2222', direction: '北' },
                    { name: 'Takeoff 3', organization: 'Organization 3', longitude: '333.333', latitude: '33.333', altitude: '3333', direction: '東' }
                ],
                landings: [
                    { name: 'Landing 1', organization: 'Organization 1', longitude: '111.111', latitude: '11.111', altitude: '1111' },
                    { name: 'Landing 2', organization: 'Organization 2', longitude: '222.222', latitude: '22.222', altitude: '2222' },
                    { name: 'Landing 3', organization: 'Organization 3', longitude: '333.333', latitude: '33.333', altitude: '3333' }
                ]
            }
        };
        axios.mockResolvedValueOnce(response);

        await loadTakeoffLanding(setScatterState);

        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            url: `${import.meta.env.VITE_API_URL}api/takeoff_landing`,
            responseType: 'json'
        });
        expect(setScatterState).toHaveBeenCalledWith(expect.any(Function));
        const stateUpdater = setScatterState.mock.calls[0][0];
        const newState = stateUpdater({});
        expect(newState.takeoffs).toEqual([
            new Takeoff('Takeoff 1', 'Organization 1', 111.111, 11.111, 1111, '南'),
            new Takeoff('Takeoff 2', 'Organization 2', 222.222, 22.222, 2222, '北'),
            new Takeoff('Takeoff 3', 'Organization 3', 333.333, 33.333, 3333, '東')
        ]);
        expect(newState.landings).toEqual([
            new Landing('Landing 1', 'Organization 1', 111.111, 11.111, 1111),
            new Landing('Landing 2', 'Organization 2', 222.222, 22.222, 2222),
            new Landing('Landing 3', 'Organization 3', 333.333, 33.333, 3333)
        ]);
    });

    it('handles errors when loading takeoffs and landings', async () => {
        const setScatterState = vi.fn();
        const error = new Error('Failed to load takeoffs and landings');
        axios.mockRejectedValueOnce(error);

        await loadTakeoffLanding(setScatterState);

        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            url: `${import.meta.env.VITE_API_URL}api/takeoff_landing`,
            responseType: 'json'
        });
        expect(setScatterState).not.toHaveBeenCalled();
    });
});
