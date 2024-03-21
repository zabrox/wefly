import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SearchCondition } from './datepicker';
import { loadTracks } from './trackloader';
import { TrackGroupSelection } from './trackGroupSelection';
import { TrackPoint } from './trackpoint';
import "@testing-library/jest-dom/vitest";

vi.mock('./trackloader', () => ({
    loadTracks: vi.fn(),
}));
vi.mock('../../cesiummap', () => ({
    removeAllEntities: vi.fn(),
}));

describe('SearchCondition', () => {
    afterEach(() => {
        loadTracks.mockClear();
        cleanup();
    });

    it('loads tracks on first load and shows date picker', () => {
        const state = { tracks: [] };
        const setState = vi.fn();
        const scatterState = {
            searchCondition: {
                from: dayjs('2024-01-01 00:00:00'),
                isAdvancedSearchEnabled: vi.fn().mockReturnValue(false),
            },
        };
        const setScatterState = vi.fn();

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchCondition
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
        );

        expect(loadTracks).toHaveBeenCalledWith(state, setState, scatterState, setScatterState);
        const date = screen.getByDisplayValue('2024-01-01 (Mon)');
        expect(date).toBeInTheDocument();
    });

    it('updates date and calls loadTracks', () => {
        const state = { tracks: ['AAA'] };
        const setState = vi.fn();
        const mockIsAdvancedSearchEnabled = vi.fn().mockReturnValue(false);
        const scatterState = {
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
            searchCondition: {
                from: dayjs('2024-01-01 00:00:00'),
                isAdvancedSearchEnabled: mockIsAdvancedSearchEnabled,
            },
        };
        const setScatterState = vi.fn();
        const newSearchCondition = {
            from: dayjs('2024-01-02 00:00:00'),
            to: dayjs('2024-01-02 23:59:59.999'),
            isAdvancedSearchEnabled: mockIsAdvancedSearchEnabled,
        };

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchCondition
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
        );

        const date = screen.getByDisplayValue('2024-01-01 (Mon)');
        fireEvent.change(date, { target: { value: '2024-01-02 (Tue)' } });

        expect(loadTracks.mock.calls.length).toBe(1);
        expect(loadTracks).toHaveBeenCalledWith(
            state,
            setState,
            {
                ...scatterState,
                searchCondition: newSearchCondition,
            },
            setScatterState
        );
    });

    it('shows advanced search condition', () => {
        const state = { tracks: ['AAA'] };
        const setState = vi.fn();
        const mockIsAdvancedSearchEnabled = vi.fn().mockReturnValue(true);
        const scatterState = {
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
            searchCondition: {
                from: dayjs('2024-01-01 00:00:00'),
                to: dayjs('2024-01-03 00:00:00'),
                pilotname: 'Takase',
                maxAltitude: 1000,
                distance: 100,
                duration: 10,
                isAdvancedSearchEnabled: mockIsAdvancedSearchEnabled,
            },
        };
        const setScatterState = vi.fn();

        render(
            <SearchCondition
                state={state}
                setState={setState}
                scatterState={scatterState}
                setScatterState={setScatterState}
            />
        );

        expect(screen.getByText('2024-01-01')).toBeInTheDocument();
        expect(screen.getByText('2024-01-03')).toBeInTheDocument();
        expect(screen.getByText('Takase')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('sets showAdvancedSearchDialog to true on handleAdvancedSearchIconClick', () => {
        const state = { tracks: ['AAA'] };
        const setState = vi.fn();
        const scatterState = {
            searchCondition: {
                from: dayjs('2024-01-01 00:00:00'),
                isAdvancedSearchEnabled: vi.fn().mockReturnValue(false),
            },
        };
        const setScatterState = vi.fn();

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchCondition
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
        );

        fireEvent.click(screen.getByTestId('AddCircleOutlineIcon'));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});