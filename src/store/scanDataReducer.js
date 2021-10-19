const initialState = {
    scannedData: null,
    sredstvo: null,
    prevPosition: null,
    itemsRemain: null,
}

export const scanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "setScannedData":
            return {...state, scannedData: payload }

        case "setPrevPosition":
            return {...state, prevPosition: payload }

        case "setSredstvo":
            return {...state, sredstvo: payload }

        case "setItemsRemain":
            return {...state, itemsRemain: payload }

        default:
            return state
    }
}