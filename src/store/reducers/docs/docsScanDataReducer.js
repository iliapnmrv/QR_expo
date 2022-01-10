import { SET_DOCS_SCAN_DATA } from "../../actions/docs/docsScanDataAction"

const initialState = {
    data: "",
}

export const docsScanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DOCS_SCAN_DATA:
            return {...state, data: payload }

        default:
            return state
    }
}