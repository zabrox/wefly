import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TrackListItem from './tracklistitem';
import "@testing-library/jest-dom/vitest";

const mockTrack = {
    getId: () => '1',
    metadata: {
        pilotname: 'Test Pilot',
        area: 'Test Area',
        startTime: { format: vi.fn(() => '2023-01-01 12:00') },
        durationString: vi.fn(() => '1h 30m'),
        maxAltitude: 1000,
        distance: 50,
        model: 'Test Model',
        maxGain: 500,
    },
};

vi.mock('../../../../util/activityicon', () => ({
    ActivityIcon: () => <div>ActivityIcon</div>,
}));

vi.mock('../../../../util/piloticon', () => ({
    PilotIcon: () => <div>PilotIcon</div>,
}));

vi.mock('../../../../util/trackcolor', () => ({
    trackColor: vi.fn(() => ({
        withAlpha: vi.fn(() => ({
            toCssHexString: vi.fn(() => '#ffffff'),
        })),
    })),
}));

describe('TrackListItem', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders track information correctly', () => {
        render(<TrackListItem track={mockTrack} selected={false} onClick={() => {}} />);

        expect(screen.getByText('Test Pilot')).toBeInTheDocument();
        expect(screen.getByText('Test Area')).toBeInTheDocument();
        expect(screen.getByText('2023-01-01 12:00')).toBeInTheDocument();
        expect(screen.getByText('1h 30m')).toBeInTheDocument();
        expect(screen.getByText('1000m (+500m)')).toBeInTheDocument();
        expect(screen.getByText('50km')).toBeInTheDocument();
        expect(screen.getByText('Test Model')).toBeInTheDocument();
    });

    it('applies selected background color when selected', () => {
        render(<TrackListItem track={mockTrack} selected={true} onClick={() => {}} />);

        const listItem = document.getElementsByClassName('tracklistitem')[0];
        expect(listItem).toHaveStyle('background-color: #ffffff');
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<TrackListItem track={mockTrack} selected={false} onClick={handleClick} />);

        const listItem = document.getElementsByClassName('tracklistitem')[0];
        fireEvent.click(listItem);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
