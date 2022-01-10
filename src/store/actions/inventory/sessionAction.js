export const SET_SESSION_STATUS = "SET_SESSION_STATUS"
export const SET_SESSION_DATE = "SET_SESSION_DATE"
export const SET_DOWNLOAD_URL = "SET_DOWNLOAD_URL"

export const setSessionStatus = (status) => {
    return {
        type: SET_SESSION_STATUS,
        payload: status
    }
}
export const setSessionDate = (date) => {
    return {
        type: SET_SESSION_DATE,
        payload: date
    }
}
export const setDownloadUrl = (url) => {
    return {
        type: SET_DOWNLOAD_URL,
        payload: url
    }
}