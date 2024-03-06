import axios from 'axios';

const radius = 20;

export const loadPlaceNames = async(longitude, latitude) => {
    const placenamesurl = `${import.meta.env.VITE_API_URL}/placenames?longitude=${longitude}&latitude=${latitude}&radius=${radius}`;
    let response = undefined;
    try {
        response = await axios({ method: "get", url: `${placenamesurl}`, responseType: "json" });
    } catch (error) {
        throw error;
    }
    return new Promise(resolve => resolve(response.data));
}