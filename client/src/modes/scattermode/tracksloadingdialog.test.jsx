import { describe, it, expect, } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TracksLoadingDialog } from './tracksloadingdialog';

describe('TracksLoadingDialog', () => {
    it('renders the loading dialog when open is true', () => {
        render(<TracksLoadingDialog open={true} />);

        const loadingDialog = screen.getByRole('dialog');
        expect(loadingDialog).toBeInTheDocument();

        const loadingText = screen.getByText('トラックの読み込み中...');
        expect(loadingText).toBeInTheDocument();
    });

    it('does not render the loading dialog when open is false', () => {
        render(<TracksLoadingDialog open={false} />);

        const loadingDialog = screen.queryByRole('dialog');
        expect(loadingDialog).not.toBeInTheDocument();
    });
});