import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FullScreenMenuItem } from './fullscreenmenuitem';
import { describe, it, expect, vi } from 'vitest';

describe('FullScreenMenuItem', () => {
    it('toggles full screen mode', () => {
        document.documentElement.requestFullscreen = vi.fn();
        document.exitFullscreen = vi.fn();

        render(<FullScreenMenuItem />);

        const switchElement = screen.getByRole('checkbox');
        expect(switchElement).not.toBeChecked();

        switchElement.click();
        expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
        expect(switchElement).toBeChecked();

        switchElement.click();
        expect(document.exitFullscreen).toHaveBeenCalled();
        expect(switchElement).not.toBeChecked();
    });
});
