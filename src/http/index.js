import axios from "axios";

export const API_URL = `http://localhost:8000/api/`;

// export const SERVER = "http://mo4-it5:8000/"

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

$api.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

$api.interceptors.response.use((config) => {
    return config
}, async(error) => {
    const originalRequest = error.config
    console.log(originalRequest);
    console.log(error.response.status);
    if (error.response.status == 401) {
        try {
            const data = await axios.get(`${API_URL}auth/refresh`, { withCredentials: true }).then(({ data }) => data)
            localStorage.setItem('token', data.accessToken)
            return $api.request(originalRequest)
        } catch (e) {
            console.log('Не авторизован');
        }
    }
});

export default $api;