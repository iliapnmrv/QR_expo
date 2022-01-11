import axios from "axios";
import { setToken } from "../store/actions/authAction";
import { store } from "../store";

// export const API_URL = `http://localhost:8000/api/`;

export const API_URL = "http://192.168.26.75:8000/api/";

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

$api.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${store.getState().auth.token}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    console.log("here");
    const originalRequest = error.config;
    console.log(originalRequest);
    console.log(error.response);
    if (error.response.status == 401 && error.config) {
      try {
        const data = await axios
          .get(`${API_URL}auth/refresh`, { withCredentials: true })
          .then(({ data }) => data);
        store.dispatch(setToken(data.accessToken));
        return $api.request(originalRequest);
      } catch (e) {
        console.log("Не авторизован");
      }
    }
    throw error.response.data.message;
  }
);

export default $api;
