import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from 'vitest';
import TrackListItemMenu from './tracklistitemmenu';

const trackWithDataSource = {
    metadata: {
        dataSource: 'http://example.com'
    }
};

const trackWithoutDataSource = {
    metadata: {
        dataSource: ''
    }
};

describe('TrackListItemMenu', () => {
    it('renders TrackListItemMenu and opens menu on click', () => {
        const { getByRole, getByText } = render(<TrackListItemMenu track={trackWithDataSource} />);

        const button = getByRole('button');
        fireEvent.click(button);

        const menuItem = getByText('元サイトを開く');
        expect(menuItem).toBeInTheDocument();
    });

    it('opens dataSource URL in a new tab when menu item is clicked', () => {
        render(<TrackListItemMenu track={trackWithDataSource} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        const menuItem = screen.getByText('元サイトを開く');
        Object.defineProperty(window, 'open', { value: vi.fn() });
        fireEvent.click(menuItem);

        expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
    });

    it('disables menu item when dataSource is empty', () => {
        render(<TrackListItemMenu track={trackWithoutDataSource} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        const menuItem = screen.getByText('元サイトを開く');
        expect(menuItem).toHaveClass('Mui-disabled');
    });
});
