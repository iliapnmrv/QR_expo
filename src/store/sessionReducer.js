const initialState = {
    sessionStatus: false,
    sessionDate: null,
}

export const sessionReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "setSessionStatus":
            return {...state, sessionStatus: payload }
        case "setSessionDate":
            return {...state, sessionDate: payload }
        default:
            return state
    }
}