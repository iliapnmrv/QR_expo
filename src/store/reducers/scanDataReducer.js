const initialState = {
    data: "",
    sredstvo: "",
    prevPosition: "",
    remains: "",
}

export const scanDataReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "setScannedData":
            return {...state, data: payload }

        case "setPrevPosition":
            return {...state, prevPosition: payload }

        case "setSredstvo":
            return {...state, sredstvo: payload }

        case "setRemains":
            return {...state, remains: payload }

        default:
            return state
    }
}