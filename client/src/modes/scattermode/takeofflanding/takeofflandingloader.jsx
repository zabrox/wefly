import axios from 'axios';
import { Takeoff } from '../../../entities/takeoff.js';
import { Landing } from '../../../entities/landing.js';

const loadTakeoffLanding = async (setScatterState) => {
    console.log(`loadTakeoffLanding`);
    const url = `${import.meta.env.VITE_API_URL}api/takeoff_landing`;
    let response = undefined;
    try {
        response = await axios({ method: "get", url: url, responseType: "json" });
        const takeoffs = response.data.takeoffs.map(takeoff => {
            return new Takeoff(
                takeoff.name,
                takeoff.organization,
                parseFloat(takeoff.longitude),
                parseFloat(takeoff.latitude),
                parseInt(takeoff.altitude),
                takeoff.direction
            )
        });
        const landings = response.data.landings.map(landing => {
            return new Landing(
                landing.name,
                landing.organization,
                parseFloat(landing.longitude),
                parseFloat(landing.latitude),
                parseInt(landing.altitude),
            )
        });
        setScatterState(state => {
            return {
                ...state,
                takeoffs: takeoffs,
                landings: landings,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export { loadTakeoffLanding };
