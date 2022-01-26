import { SET_IP } from "../actions/settingsAction";

const defaultState = {
    ip: "http://192.168.26.75:8000/api/",
};

export const settingsReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SET_IP:
            return {...state, ip: payload };
        default:
            return state;
    }
};