import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SearchConditionDisplay, SearchConditionDisplayImpl } from './searchconditiondisplay';
import { loadTracks } from '../trackloader';
import { TrackGroupSelection } from '../trackGroupSelection';
import { TrackPoint } from '../trackpoint';
import "@testing-library/jest-dom/vitest";

vi.mock('../trackloader', () => ({
    loadTracks: vi.fn(),
}));
vi.mock('../../../cesiummap', () => ({
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
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
        };
        const setScatterState = vi.fn();

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchConditionDisplay
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
        );

        const searchCondition = {
            from: dayjs().startOf('day'),
            to: dayjs().endOf('day'),
            pilotname: "",
            maxAltitude: undefined,
            distance: undefined,
            duration: undefined,
            activities: ['Paraglider', 'Hangglider', 'Glider', 'Other'],
            bounds: undefined,
        };
        expect(loadTracks).toHaveBeenCalledWith(searchCondition, state, setState, scatterState, setScatterState);
        const date = screen.getByDisplayValue(dayjs().format('YYYY-MM-DD (ddd)'));
        expect(date).toBeInTheDocument();
    });

    it('updates date and calls loadTracks', () => {
        const state = { tracks: ['AAA'] };
        const setState = vi.fn();
        const scatterState = {
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
        };
        const setScatterState = vi.fn();
        const firstDay = dayjs().startOf('month');
        const newSearchCondition = {
            from: firstDay.startOf('day'),
            to: firstDay.endOf('day'),
            pilotname: "",
            maxAltitude: undefined,
            distance: undefined,
            duration: undefined,
            activities: ['Paraglider', 'Hangglider', 'Glider', 'Other'],
            bounds: undefined,
        };

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchConditionDisplay
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
        );

        const date = screen.getByDisplayValue(dayjs().format('YYYY-MM-DD (ddd)'));
        fireEvent.click(date);
        const targetDate = screen.getByText("1");
        fireEvent.click(targetDate);
        const okButton = screen.getByText("OK");
        fireEvent.click(okButton);

        expect(loadTracks.mock.calls.length).toBe(1);
        expect(loadTracks).toHaveBeenCalledWith(
            newSearchCondition,
            state,
            setState,
            scatterState,
            setScatterState
        );
    });

    it('shows advanced search condition', () => {
        const state = { tracks: ['AAA'] };
        const setState = vi.fn();
        const mockIsAdvancedSearchEnabled = vi.fn().mockReturnValue(true);
        const searchCondition = {
            from: dayjs('2024-01-01 00:00:00'),
            to: dayjs('2024-01-03 00:00:00'),
            pilotname: 'Takase',
            maxAltitude: 1000,
            distance: 100,
            duration: 10,
            isAdvancedSearchEnabled: mockIsAdvancedSearchEnabled,
        };
        const scatterState = {
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
        };
        const setScatterState = vi.fn();

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <SearchConditionDisplayImpl
                    searchCondition={searchCondition}
                    setSearchCondition={vi.fn()}
                    state={state}
                    setState={setState}
                    scatterState={scatterState}
                    setScatterState={setScatterState}
                />
            </LocalizationProvider>
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
                <SearchConditionDisplay
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