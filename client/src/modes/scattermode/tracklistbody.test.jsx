import dayjs from 'dayjs';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TrackListBody } from './tracklistbody';
import { TrackGroupSelection } from './trackGroupSelection';
import { TrackGroup } from '../../entities/trackgroup';
import "@testing-library/jest-dom/vitest";

const mockTracks = [
    {
        getId: () => 'Takase_20240311120000',
        metadata: {
            activity: 'Paraglider',
            pilotname: 'Takase',
            model: 'Kangri',
            area: 'Asagiri',
            startTime: dayjs('2024-03-11T12:00:00Z'),
            duration: 60,
            durationString: () => '1h 0m',
            maxAltitude: 2000,
            distance: 10.0,
        }
    },
    {
        getId: () => 'Yoshida_20240311130000',
        metadata: {
            activity: 'Hangglider',
            pilotname: 'Yoshida',
            model: 'Atos',
            area: 'Tanna',
            startTime: dayjs('2024-03-11T13:00:00Z'),
            duration: 120,
            durationString: () => '2h 0m',
            maxAltitude: 3000,
            distance: 13.0,
        }
    },
    {
        getId: () => 'Yukari_20240311110000',
        metadata: {
            activity: 'Glider',
            pilotname: 'Yukari',
            model: 'Kibo',
            area: 'Ongata',
            startTime: dayjs('2024-03-11T11:00:00Z'),
            duration: 6,
            durationString: () => '6m',
            maxAltitude: 200,
            distance: 5.0,
        }
    },
];

describe('TrackListBody', () => {
    afterEach(() => {
        cleanup();
    });

    it('shows tracks', async () => {
        const mockSelectedTracks = new Set(['']);
        const mockOnTrackClicked = vi.fn();

        render(
            <TrackListBody
                state={{ tracks: mockTracks }}
                scatterState={{
                    selectedTrackGroups: { filterTracks: (tracks) => tracks },
                    selectedTracks: mockSelectedTracks,
                    orderBy: 'starttime',
                    order: 'asc',
                }}
                onTrackClicked={mockOnTrackClicked}
            />
        );

        const rows = screen.getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Yukari');
        expect(rows[0]).toHaveTextContent('Ongata');
        expect(rows[0]).toHaveTextContent('24-03-11 20:00');
        expect(rows[0]).toHaveTextContent('6m');
        expect(rows[0]).toHaveTextContent('200m');
        expect(rows[0]).toHaveTextContent('5km');
    });

    it('sorts tracks correctly', async () => {
        const conditions = [
            { orderBy: 'pilotname', order: 'asc', expected: ['Takase', 'Yoshida', 'Yukari'] },
            { orderBy: 'activity', order: 'asc', expected: ['Yukari', 'Yoshida', 'Takase'] },
            { orderBy: 'model', order: 'asc', expected: ['Yoshida', 'Takase', 'Yukari'] },
            { orderBy: 'area', order: 'asc', expected: ['Takase', 'Yukari', 'Yoshida'] },
            { orderBy: 'starttime', order: 'asc', expected: ['Yukari', 'Takase', 'Yoshida'] },
            { orderBy: 'duration', order: 'desc', expected: ['Yoshida', 'Takase', 'Yukari'] },
            { orderBy: 'maxalt', order: 'desc', expected: ['Yoshida', 'Takase', 'Yukari'] },
            { orderBy: 'distance', order: 'desc', expected: ['Yoshida', 'Takase', 'Yukari'] },
        ]
        conditions.forEach((condition) => {
            const mockSelectedTracks = new Set(['']);
            const mockOnTrackClicked = vi.fn();

            render(
                <TrackListBody
                    state={{ tracks: mockTracks }}
                    scatterState={{
                        selectedTrackGroups: { filterTracks: (tracks) => tracks },
                        selectedTracks: mockSelectedTracks,
                        orderBy: condition.orderBy,
                        order: condition.order,
                    }}
                    onTrackClicked={mockOnTrackClicked}
                />
            );

            const rows = screen.getAllByRole('row');
            rows.forEach((row, i) => {
                expect(row).toHaveTextContent(condition.expected[i]);
            });
            cleanup();
        });
    });

    it('filters tracks in unselected trackgroups', async () => {
        const mockSelectedTracks = new Set(['']);
        const mockOnTrackClicked = vi.fn();
        const trackGroupSelection = new TrackGroupSelection();
        const trackGroup = new TrackGroup(1, [135.8, 35.7], ['Takase_20240311120000', 'Yukari_20240311110000']);
        trackGroupSelection.add(trackGroup);

        render(
            <TrackListBody
                state={{ tracks: mockTracks }}
                scatterState={{
                    selectedTrackGroups: trackGroupSelection,
                    selectedTracks: mockSelectedTracks,
                    orderBy: 'starttime',
                    order: 'asc',
                }}
                onTrackClicked={mockOnTrackClicked}
            />
        );

        const rows = screen.getAllByRole('row');
        expect(rows[0]).toHaveTextContent('Yukari');
        expect(rows[1]).toHaveTextContent('Takase');
    });

    it('calls onTrackClicked func', async () => {
        const mockSelectedTracks = new Set(['']);
        const mockOnTrackClicked = vi.fn();

        render(
            <TrackListBody
                state={{ tracks: mockTracks }}
                scatterState={{
                    selectedTrackGroups: { filterTracks: (tracks) => tracks },
                    selectedTracks: mockSelectedTracks,
                    orderBy: 'starttime',
                    order: 'asc',
                }}
                onTrackClicked={mockOnTrackClicked}
            />
        );

        const rows = screen.getAllByRole('row');
        fireEvent.click(rows[0]);
        expect(mockOnTrackClicked.mock.calls.length).toBe(1);
        expect(mockOnTrackClicked).toHaveBeenCalledWith('Yukari_20240311110000');
    });
});
