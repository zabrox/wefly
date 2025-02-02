import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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

test('renders TrackListItemMenu and opens menu on click', () => {
    const { getByRole, getByText } = render(<TrackListItemMenu track={trackWithDataSource} />);

    const button = getByRole('button');
    fireEvent.click(button);

    const menuItem = getByText('元サイトを開く');
    expect(menuItem).toBeInTheDocument();
});

test('opens dataSource URL in a new tab when menu item is clicked', () => {
    const { getByRole, getByText } = render(<TrackListItemMenu track={trackWithDataSource} />);

    const button = getByRole('button');
    fireEvent.click(button);

    const menuItem = getByText('元サイトを開く');
    Object.defineProperty(window, 'open', { value: jest.fn() });
    fireEvent.click(menuItem);

    expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
});

test('disables menu item when dataSource is empty', () => {
    const { getByRole, getByText } = render(<TrackListItemMenu track={trackWithoutDataSource} />);

    const button = getByRole('button');
    fireEvent.click(button);

    const menuItem = getByText('元サイトを開く');
    expect(menuItem).toBeDisabled();
});
