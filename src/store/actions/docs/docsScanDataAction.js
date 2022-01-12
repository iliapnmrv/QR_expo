export const SET_DOCS_SCAN_DATA = "SET_DOCS_SCAN_DATA"
export const SET_DOCS_ANALYSIS = "SET_DOCS_ANALYSIS"
export const SET_DOCS_ITEM = "SET_DOCS_ITEM"

export const setDocsScanData = (data) => {
    return {
        type: SET_DOCS_SCAN_DATA,
        payload: data
    }
}
export const setDocsAnalysis = (analysis) => {
    return {
        type: SET_DOCS_ANALYSIS,
        payload: analysis
    }
}
export const setDocsItem = (data) => {
    return {
        type: SET_DOCS_ITEM,
        payload: data
    }
}