import axios from "axios";
import dayjs from "dayjs";
import { Metadata } from '../../entities/metadata';
import { Track } from '../../entities/track';
import { groupTracks } from './trackgrouper';
import * as CesiumMap from '../../cesiummap';

export const loadMetadatas = async (searchCondition) => {
    const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata`;
    try {
        console.time('loadTracks');
        const bounds = searchCondition.bounds.flat().join(',');
        const response = await axios({
            method: "get",
            url: metadatasurl, 
            responseType: "json",
            params: {
                from: searchCondition.from.format('YYYY-MM-DDTHH:mm:ssZ'),
                to: searchCondition.to.format('YYYY-MM-DDTHH:mm:ssZ'),
                pilotname: searchCondition.pilotname,
                maxAltitude: searchCondition.maxAltitude,
                distance: searchCondition.distance,
                duration: searchCondition.duration,
                bounds: bounds,
            }
        });
        console.timeEnd('loadTracks');
        return response.data.map(metadata => Metadata.deserialize(metadata));
    } catch (error) {
        throw error;
    }
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
        const response = await axios({ method: "get", url: `${pathsurl}${trackids}` })
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
        const metadatas = await loadMetadatas(scatterState.searchCondition);
        tracks = metadatas.map(metadata => {
            const t = new Track();
            t.metadata = metadata;
            return t;
        });
        trackGroups = groupTracks(tracks);
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
