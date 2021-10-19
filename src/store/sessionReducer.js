const initialState = {
    sessionStatus: false,
    sessionInfo: "Сессия закрыта",
    sessionBtn: "Открыть сессию",
    sessionDate: null,
}

export const sessionReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "setSessionStatus":
            return {...state, sessionStatus: payload }

        case "setSessionInfo":
            return {...state, sessionInfo: payload }

        case "setSessionBtn":
            return {...state, sessionBtn: payload }

        case "setSessionDate":
            return {...state, sessionDate: payload }

        default:
            return state
    }
}