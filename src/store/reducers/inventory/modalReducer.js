import { TOGGLE_CLOSE_SESSION_MODAL, TOGGLE_DOWNLOAD_LINK_MODAL, TOGGLE_SCAN_MODAL } from "../../actions/inventory/modalAction"

const initialState = {
    scanModal: false,
    downloadLinkModal: false,
    closeSessionModal: false
}

export const modalReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case TOGGLE_SCAN_MODAL:
            return {...state, scanModal: payload }

        case TOGGLE_DOWNLOAD_LINK_MODAL:
            return {...state, downloadLinkModal: payload }

        case TOGGLE_CLOSE_SESSION_MODAL:
            return {...state, closeSessionModal: payload }

        default:
            return state
    }
}