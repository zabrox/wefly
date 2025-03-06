import axios from 'axios';
import { Organization } from '../../../entities/organization.js';

const loadOrganizations = async (setScatterState) => {
    console.log(`loadOrganizations`);
    const url = `${import.meta.env.VITE_API_URL}api/organizations`;
    let response = undefined;
    try {
        response = await axios({ method: "get", url: url, responseType: "json" });
        const organizations = response.data.organizations.map(org => {
            const organization = new Organization();
            organization.name = org.name;
            organization.homepage = org.homepage;
            return organization;
        });
        setScatterState(state => {
            return {
                ...state,
                organizations: organizations
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export { loadOrganizations };
