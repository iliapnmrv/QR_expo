import axios from 'axios'
import $api, { API_URL } from 'http/index.js';
import { showMessage } from 'react-native-flash-message';
import { setUser } from "store/actions/authAction.js";
import { store } from '../store';
import { setIsSignedin, setToken } from '../store/actions/authAction';
class AuthService {
    async registration(login, password) {
        const registrationData = await $api.post('auth/registration/', {
                login,
                password
            }).then(({ data }) => data)
            .catch(message => {
                showMessage({
                    message: `${message}`,
                    type: "danger",
                });
            })
        store.dispatch(setUser(JSON.stringify(registrationData.user)))
        store.dispatch(setToken(registrationData.accessToken))
        store.dispatch(setIsSignedin(true))
        return registrationData
    }

    async login(login, password) {
        const loginData = await $api.post('auth/login/', {
                login,
                password
            }).then(({ data }) => data)
            .catch(message => {
                showMessage({
                    message: `${message}`,
                    type: "danger",
                });
            })
        console.log(loginData);

        store.dispatch(setUser(JSON.stringify(loginData.user)))
        store.dispatch(setToken(loginData.accessToken))
        store.dispatch(setIsSignedin(true))

        return loginData
    }

    async logout() {
        store.dispatch(setUser(""))
        store.dispatch(setToken(""))
        store.dispatch(setIsSignedin(false))
        return $api.post('auth/logout/')
    }

    async checkAuth() {
        const data = await axios.get(`${API_URL}auth/refresh`, { withCredentials: true }).then(({ data }) => data)
        store.dispatch(setToken(data.accessToken))
        return data
    }
}

export default new AuthService