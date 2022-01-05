export const SET_SCAN_DATA = "SET_SCAN_DATA"
export const SET_PREV_POSITION = "SET_PREV_POSITION"
export const SET_SREDSTVO = "SET_SREDSTVO"
export const SET_REMAINS = "SET_REMAINS"

export const setScanData = (data) => {
    return {
        type: SET_SCAN_DATA,
        payload: data
    }
}
export const setPrevPosition = (prevPosition) => {
    return {
        type: SET_PREV_POSITION,
        payload: prevPosition
    }
}
export const setSredstvo = (sredstvo) => {
    return {
        type: SET_SREDSTVO,
        payload: sredstvo
    }
}
export const setRemains = (remains) => {
    return {
        type: SET_REMAINS,
        payload: remains
    }
}