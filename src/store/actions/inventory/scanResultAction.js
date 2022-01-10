export const SET_SCAN_STATUS = "SET_SCAN_STATUS"
export const SET_SCAN_RESULT = "SET_SCAN_RESULT"

export const setScanStatus = (status) => {
    return {
        type: SET_SCAN_STATUS,
        payload: status
    }
}

export const setScanResult = (result) => {
    return {
        type: SET_SCAN_RESULT,
        payload: result
    }
}