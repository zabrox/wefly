import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TracksLoadingDialog } from './tracksloadingdialog';
import "@testing-library/jest-dom/vitest";

describe('TracksLoadingDialog', () => {
    afterEach(() => {
        cleanup();
    });
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