import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom/vitest";

vi.mock('./scattermap', () => ({
    getTracksInPerspective: vi.fn(() => 'mocked getTracksInPerspective result'),
    leaveScatterMode: vi.fn(() => 'mocked leaveScatterMode result'),
}));

import { ScatterActionDial } from './scatteractiondial';
import * as scattermap from './scattermap';
import * as Mode from '../mode';

describe('ScatterActionDial', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the action dial component', () => {
        render(<ScatterActionDial state={{}} setState={() => { }} scatterState={{}} />);

        const actionDial = screen.getByRole('button', { name: 'Scatter Mode Action Dial' });
        expect(actionDial).toBeInTheDocument();
    });

    it('calls the onClick function when the first action is clicked', async () => {
        const mockSetState = vi.fn();
        const mockSelectedTracks = new Set();
        mockSelectedTracks.add("Takase_20240203120000");
        mockSelectedTracks.add("Hirayama_20240203100000");
        const mockTracks = [
            { getId: () => "Takase_20240203120000" },
            { getId: () => "Hirayama_20240203100000" },
            { getId: () => "Okuda_20240203110000" }];

        render(
            <ScatterActionDial
                state={{ controlPanelSize: 100, tracks: mockTracks }}
                setState={mockSetState}
                scatterState={{ selectedTracks: mockSelectedTracks }}
            />
        );

        const actionDial = screen.getByRole('button', { name: 'Scatter Mode Action Dial' });
        fireEvent.click(actionDial);

        const playbackSelected = screen.getByText('選択中のトラックを再生');
        fireEvent.click(playbackSelected);

        expect(scattermap.leaveScatterMode).toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledWith({
            controlPanelSize: 100,
            tracks: mockTracks,
            mode: Mode.PLAYBACK_MODE,
            actionTargetTracks: mockTracks.slice(0, 2),
        });
    });

    it('calls the onClick function when the second action is clicked', async () => {
        const mockSetState = vi.fn();
        const mockSelectedTracks = new Set();
        const mockTracks = [
            { getId: () => "Takase_20240203120000" },
            { getId: () => "Hirayama_20240203100000" },
            { getId: () => "Okuda_20240203110000" }];
        const mockTracksInPerspective = mockTracks.slice(1, 3);
        scattermap.getTracksInPerspective.mockReturnValue(mockTracksInPerspective);

        render(
            <ScatterActionDial
                state={{ controlPanelSize: 100, tracks: mockTracks }}
                setState={mockSetState}
                scatterState={{ selectedTracks: mockSelectedTracks }}
            />
        );

        const actionDial = screen.getByRole('button', { name: 'Scatter Mode Action Dial' });
        fireEvent.click(actionDial);

        const playbackPerspective = screen.getByText('視野内のトラックを再生');
        fireEvent.click(playbackPerspective);

        expect(scattermap.leaveScatterMode).toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledWith({
            controlPanelSize: 100,
            tracks: mockTracks,
            mode: Mode.PLAYBACK_MODE,
            actionTargetTracks: mockTracksInPerspective,
        });
    });

    it('displays an error message when no tracks are selected', async () => {
        const mockSetState = vi.fn();
        const mockSelectedTracks = new Set();
        const mockTracks = [
            { getId: () => "Takase_20240203120000" },
            { getId: () => "Hirayama_20240203100000" },
            { getId: () => "Okuda_20240203110000" }];

        render(
            <ScatterActionDial
                state={{ controlPanelSize: 100, tracks: mockTracks }}
                setState={mockSetState}
                scatterState={{ selectedTracks: mockSelectedTracks }}
            />
        );

        const actionDial = screen.getByRole('button', { name: 'Scatter Mode Action Dial' });
        fireEvent.click(actionDial);

        const playbackSelected = screen.getByText('選択中のトラックを再生');
        fireEvent.click(playbackSelected);

        const errorMessage = screen.getByText('再生するトラックを選択してください');
        expect(errorMessage).toBeInTheDocument();
    });

    it('displays an error message when no tracks are in perspective', async () => {
        const mockSetState = vi.fn();
        const mockSelectedTracks = new Set();
        const mockTracks = [
            { getId: () => "Takase_20240203120000" },
            { getId: () => "Hirayama_20240203100000" },
            { getId: () => "Okuda_20240203110000" }];
        scattermap.getTracksInPerspective.mockReturnValue([]);

        render(
            <ScatterActionDial
                state={{ controlPanelSize: 100, tracks: mockTracks }}
                setState={mockSetState}
                scatterState={{ selectedTracks: mockSelectedTracks }}
            />
        );

        const actionDial = screen.getByRole('button', { name: 'Scatter Mode Action Dial' });
        fireEvent.click(actionDial);

        const playbackPerspective = screen.getByText('視野内のトラックを再生');
        fireEvent.click(playbackPerspective);

        const errorMessage = screen.getByText('視野内に再生可能なトラックがありません');
        expect(errorMessage).toBeInTheDocument();
    });
});