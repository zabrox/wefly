import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ShowTrackPointsMenuItem } from './showtrackpointsmenuitem';
import { describe, it, expect, vi } from 'vitest';

describe('ShowTrackPointsMenuItem', () => {
    it('toggles track points visibility', () => {
        const scatterState = { isTrackPointVisible: false };
        const setScatterState = vi.fn();

        render(<ShowTrackPointsMenuItem scatterState={scatterState} setScatterState={setScatterState} />);

        const switchElement = screen.getByRole('checkbox');
        expect(switchElement).not.toBeChecked();

        switchElement.click();
        expect(setScatterState).toHaveBeenCalledWith({
            ...scatterState,
            isTrackPointVisible: true,
        });

        scatterState.isTrackPointVisible = true;
        switchElement.click();
        expect(setScatterState).toHaveBeenCalledWith({
            ...scatterState,
            isTrackPointVisible: false,
        });
    });
});
