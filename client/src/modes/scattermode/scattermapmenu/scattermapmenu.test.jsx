import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ScatterMapMenu } from './scattermapmenu';
import { describe, it, expect, vi } from 'vitest';

describe('ScatterMapMenu', () => {
    it('opens and closes the menu', () => {
        const scatterState = { isTrackPointVisible: false };
        const setScatterState = vi.fn();

        render(<ScatterMapMenu scatterState={scatterState} setScatterState={setScatterState} />);

        const button = screen.getByRole('button', { name: /more/i });
        fireEvent.click(button);

        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();

        const menuitems = screen.getAllByRole('menuitem');
        expect(menuitems).toHaveLength(2);
        menuitems.forEach((menuitem) => {
            expect(menuitem).toBeInTheDocument();
        });
    });
});
