import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const signup = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    signup,
    login,
    logout,
};

export default authService;
