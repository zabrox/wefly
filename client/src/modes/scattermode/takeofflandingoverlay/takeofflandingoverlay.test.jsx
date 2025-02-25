import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { TakeoffLandingOverlay } from './takeofflandingoverlay';
import { Takeoff } from '../../../entities/takeoff';
import { Landing } from '../../../entities/landing';

describe('TakeoffLandingOverlay', () => {
    const mockScatterState = {
        selectedTakeoffLanding: new Takeoff('Takeoff 1', 'Organization 1', 111.111, 11.111, 1111, '南')
    };

    afterEach(() => {
        cleanup();
    });

    it('displays takeoff information correctly', () => {
        render(<TakeoffLandingOverlay scatterState={mockScatterState} />);
        expect(screen.getByText('Takeoff 1')).toBeInTheDocument();
        expect(screen.getByText('Organization 1')).toBeInTheDocument();
        expect(screen.getByText('1111m')).toBeInTheDocument();
        expect(screen.getByText('南')).toBeInTheDocument();
    });

    it('displays landing information correctly', () => {
        const mockScatterStateLanding = {
            selectedTakeoffLanding: new Landing('Landing 1', 'Organization 1', 111.111, 11.111, 1111)
        };
        render(<TakeoffLandingOverlay scatterState={mockScatterStateLanding} />);
        expect(screen.getByText('Landing 1')).toBeInTheDocument();
        expect(screen.getByText('Organization 1')).toBeInTheDocument();
        expect(screen.getByText('1111m')).toBeInTheDocument();
    });

    it('does not render if no selected takeoff or landing', () => {
        const emptyScatterState = { selectedTakeoffLanding: undefined };
        const { container } = render(<TakeoffLandingOverlay scatterState={emptyScatterState} />);
        expect(container).toBeEmptyDOMElement();
    });
});
