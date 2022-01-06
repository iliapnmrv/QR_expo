import axios from 'axios'
import $api, { API_URL } from 'http/index.js';
import { setUser } from "store/actions/authAction.js";
class AuthService {
    async registration(login, password) {
        const registrationData = await $api.post('auth/registration/', {
            login,
            password
        }).then(({ data }) => data)
        setUser(JSON.stringify(registrationData.user), registrationData.accessToken)
        return registrationData
    }

    async login(login, password) {
        const loginData = $api.post('auth/login/', {
            login,
            password
        }).then(({ data }) => data)
        setUser(JSON.stringify(loginData.user), loginData.accessToken)
        return loginData
    }

    async logout() {
        setUser()
        return $api.post('auth/logout/')
    }

    async checkAuth() {

        const data = await axios.get(`${API_URL}auth/refresh`, { withCredentials: true }).then(({ data }) => data)
        console.log(data, "data");
        // setUser(data.accessToken)
        return data
    }
}

export default new AuthService