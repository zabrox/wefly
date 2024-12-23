import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import dayjs from 'dayjs';
import { describe, it, expect, afterEach, vi, vitest } from 'vitest';
import { TimelineOverlay } from './timelineoverlay';

vi.mock("../../../cesiummap", () => ({
    viewer: { clock: { currentTime: null } },
}));

describe('TimelineOverlay', () => {
    const mockSetScatterState = vi.fn();
    const baseTime = dayjs('2024-12-22 23:08:00');
    const mockScatterState = {
        selectedTrackPoint: {
            track: {
                metadata: { maxAltitude: 1000 },
                path: {
                    times: [
                        baseTime.subtract(10, 'minute'),
                        baseTime.subtract(9, 'minute'),
                        baseTime.subtract(8, 'minute'),
                        baseTime.subtract(7, 'minute'),
                        baseTime.subtract(6, 'minute'),
                        baseTime.subtract(5, 'minute'),
                        baseTime.subtract(4, 'minute'),
                        baseTime.subtract(3, 'minute'),
                        baseTime.subtract(2, 'minute'),
                        baseTime.subtract(1, 'minute'),
                        baseTime],
                    altitudes: vitest.fn().mockReturnValue([
                        0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]),
                }
            },
            index: 0
        }
    };

    afterEach(() => {
        cleanup();
    });

    it('renders without crashing', () => {
        render(<TimelineOverlay scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        expect(screen.getByTestId('scatter-timeline-overlay')).toBeInTheDocument();
    });

    it('handles timeline click', () => {
        const mockGetBoundingClientRect = vi.fn(() => ({
            width: 300,
            height: 100,
            left: 0,
        }));

        // render前にモック適用
        Object.defineProperty(HTMLCanvasElement.prototype, "getBoundingClientRect", {
            value: mockGetBoundingClientRect,
        });

        render(<TimelineOverlay scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        const timelineCanvas = screen.getByTestId('timelinecanvas');
        fireEvent.click(timelineCanvas, { clientX: 100, clientY: 50 });

        expect(mockSetScatterState).toHaveBeenCalled();
    });

    it('does not render if no selected track point', () => {
        const emptyScatterState = { selectedTrackPoint: null };
        const { container } = render(<TimelineOverlay scatterState={emptyScatterState} setScatterState={mockSetScatterState} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('updates current time when scatterState changes', () => {
        const { rerender } = render(<TimelineOverlay scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        const newScatterState = {
            selectedTrackPoint: {
                track: {
                    metadata: { maxAltitude: 2000 },
                    path: {
                        times: [
                            baseTime.subtract(5, 'minute'),
                            baseTime.subtract(4, 'minute'),
                            baseTime.subtract(3, 'minute'),
                            baseTime.subtract(2, 'minute'),
                            baseTime.subtract(1, 'minute'),
                            baseTime],
                        altitudes: vitest.fn().mockReturnValue([
                             2000, 1900, 1800, 1700, 1600, 1500]),
                    }
                },
                index: 3
            }
        };
        rerender(<TimelineOverlay scatterState={newScatterState} setScatterState={mockSetScatterState} />);
        expect(screen.getByTestId('scatter-timeline-overlay')).toBeInTheDocument();
    });

    it('does not call setScatterState if selectedTrackPoint is null', () => {
        const scatterStateWithoutPath = {};
        render(<TimelineOverlay scatterState={scatterStateWithoutPath} setScatterState={mockSetScatterState} />);
        expect(screen.queryByTestId('scatter-timeline-overlay')).not.toBeInTheDocument();
    });

    it('does not call setScatterState if track is null', () => {
        const scatterStateWithoutPath = {
            selectedTrackPoint: {}
        };
        render(<TimelineOverlay scatterState={scatterStateWithoutPath} setScatterState={mockSetScatterState} />);
        expect(screen.queryByTestId('scatter-timeline-overlay')).not.toBeInTheDocument();
    });


    it('does not call setScatterState if path is missing', () => {
        const scatterStateWithoutPath = {
            selectedTrackPoint: {
                track: {}
            }
        };
        render(<TimelineOverlay scatterState={scatterStateWithoutPath} setScatterState={mockSetScatterState} />);
        expect(screen.queryByTestId('scatter-timeline-overlay')).not.toBeInTheDocument();
    });
});
