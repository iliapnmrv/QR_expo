import { SET_DOCS_ANALYSIS, SET_DOCS_ITEM, SET_DOCS_SCAN_DATA, SET_PREV_SELECT } from "../../actions/docs/docsScanDataAction"

const initialState = {
    data: "",
    analysis: "",
    item: "",
    prevSelect: {
        person: "",
        owner: "",
        storage: "",
        status: "",
    }
}

export const docsScanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_DOCS_SCAN_DATA:
            return {...state, data: payload }
        case SET_DOCS_ANALYSIS:
            return {...state, analysis: payload }
        case SET_DOCS_ITEM:
            return {...state, item: payload }
        case SET_PREV_SELECT:
            return {...state, prevSelect: payload }

        default:
            return state
    }
}