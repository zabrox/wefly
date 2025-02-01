import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TrackListItemMenu from './tracklistitemmenu';

const track = {
    metadata: {
        dataSource: 'http://example.com'
    }
};

test('renders TrackListItemMenu and opens menu on click', () => {
    const { getByRole, getByText } = render(<TrackListItemMenu track={track} />);

    const button = getByRole('button');
    fireEvent.click(button);

    const menuItem = getByText('元サイトを開く');
    expect(menuItem).toBeInTheDocument();
});

test('opens dataSource URL in a new tab when menu item is clicked', () => {
    const { getByRole, getByText } = render(<TrackListItemMenu track={track} />);

    const button = getByRole('button');
    fireEvent.click(button);

    const menuItem = getByText('元サイトを開く');
    Object.defineProperty(window, 'open', { value: jest.fn() });
    fireEvent.click(menuItem);

    expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
});
