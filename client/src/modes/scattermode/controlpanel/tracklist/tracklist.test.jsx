import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TrackList } from './tracklist';
import "@testing-library/jest-dom/vitest";

const mockState = {
    tracks: [
        {
            getId: () => '1',
            metadata: {
                pilotname: 'Pilot 1',
                area: 'Area 1',
                startTime: { format: vi.fn(() => '2023-01-01 12:00') },
                durationString: vi.fn(() => '1h 30m'),
                maxAltitude: 1000,
                distance: 50,
                model: 'Model 1',
            },
        },
        {
            getId: () => '2',
            metadata: {
                pilotname: 'Pilot 2',
                area: 'Area 2',
                startTime: { format: vi.fn(() => '2023-01-02 12:00') },
                durationString: vi.fn(() => '2h 30m'),
                maxAltitude: 2000,
                distance: 100,
                model: 'Model 2',
            },
        },
    ],
};

const mockScatterState = {
    tracksInPerspective: [
        {
            getId: () => '1',
            metadata: {
                pilotname: 'Pilot 1',
                area: 'Area 1',
                startTime: { format: vi.fn(() => '2023-01-01 12:00') },
                durationString: vi.fn(() => '1h 30m'),
                maxAltitude: 1000,
                distance: 50,
                model: 'Model 1',
            },
        },
        {
            getId: () => '2',
            metadata: {
                pilotname: 'Pilot 2',
                area: 'Area 2',
                startTime: { format: vi.fn(() => '2023-01-02 12:00') },
                durationString: vi.fn(() => '2h 30m'),
                maxAltitude: 2000,
                distance: 100,
                model: 'Model 2',
            },
        },
    ],
    trackGroupsInPerspective: [],
    selectedTracks: new Set(),
    orderBy: 'pilotname',
    order: 'asc',
};

const handleTrackClick = vi.fn();

describe('TrackList', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders track list correctly', () => {
        render(<TrackList state={mockState} scatterState={mockScatterState} onTrackClicked={handleTrackClick} />);

        expect(screen.getByText('Pilot 1')).toBeInTheDocument();
        expect(screen.getByText('Pilot 2')).toBeInTheDocument();
    });

    it('calls onTrackClicked when a track is clicked', () => {
        render(<TrackList state={mockState} scatterState={mockScatterState} onTrackClicked={handleTrackClick} />);

        const trackItem = screen.getByText('Pilot 1');
        fireEvent.click(trackItem);

        expect(handleTrackClick).toHaveBeenCalledWith('1');
    });

    it('sorts tracks correctly based on scatterState order', () => {
        const scatterStateDesc = { ...mockScatterState, order: 'desc' };
        render(<TrackList state={mockState} scatterState={scatterStateDesc} onTrackClicked={handleTrackClick} />);

        const trackItems = screen.getAllByRole('button');
        expect(trackItems[0]).toHaveTextContent('Pilot 2');
        expect(trackItems[1]).toHaveTextContent('Pilot 1');
    });
});
