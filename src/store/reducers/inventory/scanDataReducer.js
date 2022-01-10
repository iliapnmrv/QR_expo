import { SET_PREV_POSITION, SET_REMAINS, SET_SCAN_DATA, SET_SREDSTVO } from "../../actions/inventory/scanDataAction"

const initialState = {
    data: "",
    sredstvo: "",
    prevPosition: "",
    remains: "",
}

export const scanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_SCAN_DATA:
            return {...state, data: payload }

        case SET_PREV_POSITION:
            return {...state, prevPosition: payload }

        case SET_SREDSTVO:
            return {...state, sredstvo: payload }

        case SET_REMAINS:
            return {...state, remains: payload }

        default:
            return state
    }
}