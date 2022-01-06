export const SET_USER = "SET_USERNAME"
export const SET_IS_SIGNEDIN = "SET_IS_SIGNEDIN"

export const setUser = (username = null, token = null) => {
    return {
        type: SET_USER,
        payload: {
            username,
            token,
        }
    }
}
export const setIsSignedin = (isSignedIn) => {
    return {
        type: SET_IS_SIGNEDIN,
        payload: isSignedIn
    }
}