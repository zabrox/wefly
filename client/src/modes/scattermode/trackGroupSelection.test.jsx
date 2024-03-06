import { describe, it, expect, beforeEach } from 'vitest';
import { TrackGroupSelection } from './trackGroupSelection';

describe('TrackGroupSelector', () => {
    let trackGroupSelection;

    beforeEach(() => {
        trackGroupSelection = new TrackGroupSelection();
    });

    it('should add a group to the selector', () => {
        const group = { trackIds: ['Takase_20240203120000', 'Hirayama_20240203100000'] };
        trackGroupSelection.add(group);

        expect(trackGroupSelection.groups.size).toBe(1);
        expect(trackGroupSelection.groups.has(group)).toBe(true);
    });

    it('should check if a group exists in the selector', () => {
        const group1 = { trackIds: ['Takase_20240203120000', 'Hirayama_20240203100000'] };
        const group2 = { trackIds: ['Okuda_20240203110000'] };
        trackGroupSelection.add(group1);

        expect(trackGroupSelection.has(group1)).toBe(true);
        expect(trackGroupSelection.has(group2)).toBe(false);
    });

    it('should check if a track is selected', () => {
        const group = { trackIds: ['Takase_20240203120000', 'Hirayama_20240203100000'] };
        trackGroupSelection.add(group);

        const track = { getId: () => 'Takase_20240203120000' };
        const selected = trackGroupSelection.containsTrack(track);

        expect(selected).toBe(true);
    });

    it('should check if a track is not selected', () => {
        const group = { trackIds: ['Takase_20240203120000', 'Hirayama_20240203100000'] };
        trackGroupSelection.add(group);

        const track = { getId: () => 'Okuda_20240203110000' };
        const selected = trackGroupSelection.containsTrack(track);

        expect(selected).toBe(false);
    });

    it('should filter tracks based on selected groups', () => {
        const group1 = { trackIds: ['Takase_20240203120000', 'Hirayama_20240203100000'] };
        const group2 = { trackIds: ['Okuda_20240203110000'] };
        trackGroupSelection.add(group1);
        trackGroupSelection.add(group2);

        const tracks = [
            { getId: () => 'Takase_20240203120000' },
            { getId: () => 'Hirayama_20240203100000' },
            { getId: () => 'Okuda_20240203110000' },
            { getId: () => 'Suzuki_20240203130000' },
        ];

        const filteredTracks = trackGroupSelection.filterTracks(tracks);

        expect(filteredTracks.length).toBe(3);
        expect(filteredTracks).toContain(tracks[0]);
        expect(filteredTracks).toContain(tracks[1]);
        expect(filteredTracks).toContain(tracks[2]);
        expect(filteredTracks).not.toContain(tracks[3]);
    });

    it('should not filter tracks if no groups are selected', () => {
        const tracks = [
            { getId: () => 'Takase_20240203120000' },
            { getId: () => 'Hirayama_20240203100000' },
            { getId: () => 'Okuda_20240203110000' },
            { getId: () => 'Suzuki_20240203130000' },
        ];

        const filteredTracks = trackGroupSelection.filterTracks(tracks);

        expect(filteredTracks.length).toBe(4);
    });
});