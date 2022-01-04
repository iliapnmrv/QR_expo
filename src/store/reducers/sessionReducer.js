const initialState = {
    status: false,
    date: null,
}

export const sessionReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "setSessionStatus":
            return {...state, status: payload }
        case "setSessionDate":
            return {...state, date: payload }
        default:
            return state
    }
}