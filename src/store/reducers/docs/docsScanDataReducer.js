import { SET_DOCS_ANALYSIS, SET_DOCS_ITEM, SET_DOCS_SCAN_DATA } from "../../actions/docs/docsScanDataAction"

const initialState = {
    data: "",
    analysis: "",
    item: ""
}

export const docsScanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DOCS_SCAN_DATA:
            return {...state, data: payload }
        case SET_DOCS_ANALYSIS:
            return {...state, analysis: payload }
        case SET_DOCS_ITEM:
            return {...state, item: payload }

        default:
            return state
    }
}