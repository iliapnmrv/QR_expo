export const SET_USER = "SET_USERNAME"
export const SET_TOKEN = "SET_TOKEN"
export const SET_IS_SIGNEDIN = "SET_IS_SIGNEDIN"

export const setUser = (username = null) => {
    return {
        type: SET_USER,
        payload: {
            username,
        }
    }
}
export const setToken = (payload) => {
    return {
        type: SET_TOKEN,
        payload
    }
}
export const setIsSignedin = (isSignedIn) => {
    return {
        type: SET_IS_SIGNEDIN,
        payload: isSignedIn
    }
}