import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TrackListSortDialog, { headers } from './tracklistsortdialog';
import "@testing-library/jest-dom/vitest";

const mockScatterState = {
    orderBy: 'pilotname',
    order: 'asc',
};

const setScatterState = vi.fn();

describe('TrackListSortDialog', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly with initial state', () => {
        render(<TrackListSortDialog open={true} onClose={() => {}} scatterState={mockScatterState} setScatterState={setScatterState} />);

        expect(screen.getByText('パイロット')).toBeInTheDocument();
        expect(screen.getByText('昇順')).toBeInTheDocument();
    });

    it('updates orderBy state on change', () => {
        render(<TrackListSortDialog open={true} onClose={() => {}} scatterState={mockScatterState} setScatterState={setScatterState} />);

        const input = document.getElementsByClassName('MuiSelect-nativeInput')[0];
        fireEvent.change(input, { target: { value: 'area' } });
        expect(screen.getByText('エリア')).toBeInTheDocument();
    });

    it('updates order state on change', () => {
        render(<TrackListSortDialog open={true} onClose={() => {}} scatterState={mockScatterState} setScatterState={setScatterState} />);

        const input = document.getElementsByClassName('MuiSelect-nativeInput')[1];
        fireEvent.change(input, { target: { value: 'desc' } });
        expect(screen.getByText('降順')).toBeInTheDocument();
    });

    it('applies changes and closes dialog on apply', () => {
        const handleClose = vi.fn();
        render(<TrackListSortDialog open={true} onClose={handleClose} scatterState={mockScatterState} setScatterState={setScatterState} />);

        const input1 = document.getElementsByClassName('MuiSelect-nativeInput')[0];
        fireEvent.change(input1, { target: { value: 'area' } });
        const input2 = document.getElementsByClassName('MuiSelect-nativeInput')[1];
        fireEvent.change(input2, { target: { value: 'desc' } });

        fireEvent.click(screen.getByText('Apply'));

        expect(setScatterState).toHaveBeenCalledWith({ ...mockScatterState, orderBy: 'area', order: 'desc' });
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('closes dialog on cancel', () => {
        const handleClose = vi.fn();
        render(<TrackListSortDialog open={true} onClose={handleClose} scatterState={mockScatterState} setScatterState={setScatterState} />);

        fireEvent.click(screen.getByText('Cancel'));

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
