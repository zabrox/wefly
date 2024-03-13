import axios from "axios";
import dayjs from "dayjs";
import { Metadata } from '../../entities/metadata';
import { TrackGroup } from '../../entities/trackgroup';
import { Track } from '../../entities/track';
import * as CesiumMap from '../../cesiummap';

export const loadTrackGroups = async (date) => {
    const trackgroupsurl = `${import.meta.env.VITE_API_URL}/trackgroups?date=`;
    let response = undefined;
    try {
        console.time('loadTrackGroups');
        response = await axios({ method: "get", url: `${trackgroupsurl}${date.format('YYYY-MM-DD')}`, responseType: "json" });
        console.timeEnd('loadTrackGroups');
    } catch (error) {
        throw error;
    }
    return response.data.map(trackgroup => {
        return TrackGroup.deserialize(trackgroup);
    });
}

export const loadMetadatas = async (date) => {
    const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata?date=`;
    let response = undefined;
    try {
        console.time('loadTracks');
        response = await axios({ method: "get", url: `${metadatasurl}${date.format('YYYY-MM-DD')}`, responseType: "json" });
        console.timeEnd('loadTracks');
    } catch (error) {
        throw error;
    }
    return response.data.map(metadata => Metadata.deserialize(metadata));
}

const convertPathsJson = (json, tracks) => {
    Object.keys(json).forEach((key) => {
        const track = tracks.find((t) => t.getId() == key);
        json[key].forEach((point) => {
            track.path.addPoint(point[0], point[1], point[2], dayjs(point[3]));
        });
    });
}

export const loadPaths = async (tracks) => {
    const pathsurl = `${import.meta.env.VITE_API_URL}/tracks/paths?trackids=`;
    console.time('loadPaths');
    try {
        const trackids = tracks.map((track) => track.getId()).join(',');
        const response = await axios({ method: "get", url: `${pathsurl}${trackids}`, responseType: "json" })
        convertPathsJson(response.data, tracks);
    } catch (error) {
        throw error;
    }
    console.timeEnd('loadPaths');
}

export const loadTracks = async (state, setState, scatterState, setScatterState) => {
    setState({ ...state, tracks: [], trackGroups: [] });
    setScatterState({ ...scatterState, loading: true })
    let tracks = [];
    let trackGroups = [];
    try {
        const metadatas = await loadMetadatas(scatterState.searchCondition.from);
        tracks = metadatas.map(metadata => {
            const t = new Track();
            t.metadata = metadata;
            return t;
        });
        trackGroups = await loadTrackGroups(scatterState.searchCondition.from);
    } catch (error) {
        console.error(error);
        setState({ ...state, tracks: [], trackGroups: [] });
        setScatterState({ ...scatterState, loading: false });
        return;
    }
    CesiumMap.zoomToTrackGroups(trackGroups);
    setState({ ...state, tracks: tracks, trackGroups: trackGroups, });
    setScatterState({ ...scatterState, loading: false });
};
