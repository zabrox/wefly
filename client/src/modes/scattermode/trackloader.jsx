import { Track } from '../../entities/track';
import { Metadata } from '../../entities/metadata';
import { Path } from '../../entities/path';
import { groupTracks } from './trackgrouper';
import * as CesiumMap from '../../cesiummap';
import { ApiClient, DefaultApi } from '../../../generated-api/src';

const apiClient = new DefaultApi(new ApiClient(import.meta.env.VITE_API_URL));

export const loadMetadatas = async (searchCondition) => {
    try {
        console.time('loadTracks');
        const bounds = searchCondition.bounds ? searchCondition.bounds.flat().join(',') : undefined;
        const response = await new Promise((resolve, reject) => {
            apiClient.apiTracksMetadataGet(
                searchCondition.from.format('YYYY-MM-DDTHH:mm:ssZ'),
                searchCondition.to.format('YYYY-MM-DDTHH:mm:ssZ'),
                {
                    pilotname: searchCondition.pilotname,
                    maxAltitude: searchCondition.maxAltitude,
                    distance: searchCondition.distance,
                    duration: searchCondition.duration,
                    bounds: bounds,
                    activities: Array.from(searchCondition.activities).join(','),
                },
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });
        console.timeEnd('loadTracks');
        return response.map(metadata => Metadata.deserialize(metadata));
    } catch (error) {
        throw error;
    }
}

const convertPathsJson = (json, tracks) => {
    Object.keys(json).forEach((key) => {
        const track = tracks.find((t) => t.getId() == key);
        track.path = Path.deserialize(json[key]);
    });
}

export const loadPaths = async (tracks) => {
    try {
        console.time('loadPaths');
        const maxTrackIds = 100;
        const trackids = tracks.map((track) => track.getId());
        let index = 0;
        const promises = [];
        while (index < tracks.length) {
            const tracksChunk = tracks.slice(index, index + maxTrackIds);
            const trackIdsQuery = trackids.slice(index, index + maxTrackIds).join(',');
            promises.push(new Promise((resolve, reject) => {
                apiClient.apiTracksPathsGet(trackIdsQuery, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        convertPathsJson(data, tracksChunk);
                        resolve();
                    }
                });
            }));
            index += maxTrackIds;
        }
        await Promise.all(promises);
        console.timeEnd('loadPaths');
    } catch (error) {
        throw error;
    }
}

export const loadTracks = async (searchCondition, state, setState, scatterState, setScatterState) => {
    setState(state => {
        return { ...state, tracks: [], trackGroups: [] }
    });
    setScatterState(state => {
        return {
            ...state,
            tracksInPerspective: [],
            trackGroupsInPerspective: [],
            loading: true
        }
    });
    let tracks = [];
    let trackGroups = [];
    try {
        const metadatas = await loadMetadatas(searchCondition);
        tracks = metadatas.map(metadata => {
            const t = new Track();
            t.metadata = metadata;
            return t;
        });
        trackGroups = groupTracks(tracks);
    } catch (error) {
        console.error(error);
        setState(state => {
            return { ...state, tracks: [], trackGroups: [] };
        });
        setScatterState(state => {
            return { ...state, loading: false };
        });
        return;
    }
    CesiumMap.zoomToTrackGroups(trackGroups);
    setState(state => {
        return { ...state, tracks: tracks, trackGroups: trackGroups, };
    });
    setScatterState(state => {
        return {
            ...state,
            tracksInPerspective: tracks,
            trackGroupsInPerspective: trackGroups,
            loading: false
        };
    });
};
