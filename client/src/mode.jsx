import { ScatterMode } from "./scattermode";
import { PlaybackMode } from "./playbackmode";

export const SCATTER_MODE = 0;
export const PLAYBACK_MODE = 1;

export const Mode = ({ state, setState }) => {
    if (state.mode === SCATTER_MODE) return <ScatterMode state={state} setState={setState} />
    if (state.mode === PLAYBACK_MODE) return <PlaybackMode state={state} setState={setState} />
}