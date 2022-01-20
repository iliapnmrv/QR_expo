import { SET_SESSION_DATE, SET_SESSION_STATUS } from "../../actions/inventory/sessionAction"

const initialState = {
    status: false,
    date: null
}

export const sessionReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_SESSION_STATUS:
            return {...state, status: payload }
        case SET_SESSION_DATE:
            return {...state, date: payload }
        default:
            return state
    }
}