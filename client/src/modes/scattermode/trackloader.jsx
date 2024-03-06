import axios from "axios";
import dayjs from "dayjs";
import { Metadata } from '../../entities/metadata';
import { TrackGroup } from '../../entities/trackgroup';

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
