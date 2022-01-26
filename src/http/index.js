import axios from "axios";
import { setIsSignedin, setToken } from "../store/actions/authAction";
import { store } from "../store";

export let API_URL;

store.subscribe(() => {
  API_URL = store.getState().settings.ip;
});

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 1000 * 3,
  headers: {
    "Content-Type": "application/json",
  },
});

$api.interceptors.request.use((config) => {
  config.baseURL = API_URL;
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
    if (error.response?.status == 401 && error?.config) {
      try {
        const data = await axios
          .get(`${API_URL}auth/refresh`, { withCredentials: true })
          .then(({ data }) => data);
        store.dispatch(setToken(data.accessToken));
        return $api.request(originalRequest);
      } catch (e) {
        store.dispatch(setIsSignedin(false));
        console.log("Не авторизован");
      }
    }
    throw error.response.data.message;
  }
);

export default $api;
