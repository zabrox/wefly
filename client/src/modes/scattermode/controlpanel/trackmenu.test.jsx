import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TrackMenu } from "./trackmenu";
import { zoomToTrackGroups } from "../../../cesiummap";
import { TrackPoint } from "../trackpoint";

// モック関数の作成
vi.mock("../../../cesiummap", () => ({
    zoomToTrackGroups: vi.fn(),
}));

describe("TrackMenu コンポーネント", () => {
    const mockState = { trackGroups: [{ id: 1 }, { id: 2 }] };
    const mockScatterState = { selectedTracks: new Set([1, 2]), selectedTrackPoint: new TrackPoint() };
    const mockSetScatterState = vi.fn();

    it("アイコンボタンが存在する", () => {
        const result = render(<TrackMenu state={mockState} scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        expect(result.container.querySelector("track-menu") == null);
    });

    it("メニューがクリックで表示される", () => {
        const result = render(<TrackMenu state={mockState} scatterState={mockScatterState} setScatterState={mockSetScatterState} />);

        // メニューが非表示であることを確認
        expect(screen.queryByText("全トラックを俯瞰") == null)

        // アイコンボタンをクリック
        const iconButton = document.getElementById("track-menu");
        fireEvent.click(iconButton);

        // メニューが表示されることを確認
        expect(screen.getByText("全トラックを俯瞰"))
    });

    it("メニュー項目をクリックするとズーム関数が呼ばれる", () => {
        render(<TrackMenu state={mockState} scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        const iconButton = document.getElementById("track-menu");
        fireEvent.click(iconButton);

        const menuItem = screen.getByText("全トラックを俯瞰");
        fireEvent.click(menuItem);

        expect(zoomToTrackGroups).toHaveBeenCalledWith(mockState.trackGroups);
    });

    it("メニュー項目をクリックするとメニューが閉じる", () => {
        render(<TrackMenu state={mockState} scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        const iconButton = document.getElementById("track-menu");
        fireEvent.click(iconButton);

        const menuItem = screen.getByText("全トラックを俯瞰");
        fireEvent.click(menuItem);

        // メニューが非表示になることを確認
        expect(screen.queryByText("全トラックを俯瞰") == null)
    });

    it("全選択解除をクリックすると選択が解除される", () => {
        render(<TrackMenu state={mockState} scatterState={mockScatterState} setScatterState={mockSetScatterState} />);
        const iconButton = document.getElementById("track-menu");
        fireEvent.click(iconButton);

        const menuItem = screen.getByText("全選択解除");
        fireEvent.click(menuItem);

        expect(mockSetScatterState).toHaveBeenCalledWith({
            ...mockScatterState,
            selectedTracks: new Set(),
            selectedTrackPoint: new TrackPoint(),
        });
    });
});
