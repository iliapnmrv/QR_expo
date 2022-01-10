export const TOGGLE_SCAN_MODAL = "TOGGLE_SCAN_MODAL"
export const TOGGLE_DOWNLOAD_LINK_MODAL = "TOGGLE_DOWNLOAD_LINK_MODAL"
export const TOGGLE_CLOSE_SESSION_MODAL = "TOGGLE_CLOSE_SESSION_MODAL"

export const toggleScanModal = (payload) => {
    return {
        type: TOGGLE_SCAN_MODAL,
        payload
    }
}
export const toggleDownloadLinkModal = (payload) => {
    return {
        type: TOGGLE_DOWNLOAD_LINK_MODAL,
        payload
    }
}
export const toggleCloseSessionModal = (payload) => {
    return {
        type: TOGGLE_CLOSE_SESSION_MODAL,
        payload
    }
}