import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TrackListHeader, headers } from './tracklistheader';
import "@testing-library/jest-dom/vitest";

describe('TrackListHeader', () => {

    afterEach(() => {
        cleanup();
    });

    it('renders the table headers correctly', () => {
        const setScatterState = vi.fn();
        const scatterState = { orderBy: '', order: '' };
        render(
            <TrackListHeader
                scatterState={scatterState}
                setScatterState={setScatterState}
            />
        );

        headers.forEach((header) => {
            if (header.label.length !== 0) {
                const headerElement = screen.getByText(header.label);
                expect(headerElement).toBeInTheDocument();
            }
        });
    });

    it('sorts correctly when a header cell is clicked', async () => {
        headers.forEach((header) => {
            if (header.id === 'activity') return;
            cleanup();
            const setScatterState = vi.fn();
            const scatterState = { orderBy: '', order: 'asc' };

            render(<TrackListHeader
                scatterState={scatterState}
                setScatterState={setScatterState} />);

            const headerCell = screen.getByText(header.label);
            fireEvent.click(headerCell);
            expect(setScatterState.mock.calls[0][0]).toStrictEqual({ ...scatterState, orderBy: header.id, order: header.defaultOrder });

            cleanup();
            scatterState.orderBy = header.id;
            scatterState.order = header.defaultOrder;
            render(<TrackListHeader
                scatterState={scatterState}
                setScatterState={setScatterState} />);

            const headerCell2 = screen.getByText(header.label);
            fireEvent.click(headerCell2);
            const secondOrder = header.defaultOrder === 'asc' ? 'desc' : 'asc';
            expect(setScatterState.mock.calls[1][0]).toStrictEqual({ ...scatterState, orderBy: header.id, order: secondOrder });
        });
    });
});