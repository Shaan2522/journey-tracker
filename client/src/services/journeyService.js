import axios from 'axios';

const API_URL = 'http://localhost:5000/api/journeys/';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
            Authorization: 'Bearer ' + user.token
        };
    } else {
        return {};
    }
};

const createJourney = (journeyData) => {
    return axios.post(API_URL, journeyData, {
        headers: getAuthHeader()
    });
};

const joinJourney = (code) => {
    return axios.get(API_URL + code, {
        headers: getAuthHeader()
    });
};

const updateDestination = (journeyId, destination) => {
    return axios.put(API_URL + journeyId + '/destination', { destination }, {
        headers: getAuthHeader()
    });
};

const journeyService = {
    createJourney,
    joinJourney,
    updateDestination,
};

export default journeyService;
