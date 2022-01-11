import { SET_IS_SIGNEDIN, SET_USER, SET_TOKEN } from "../actions/authAction";

const initialState = {
  isSignedIn: false,
  user: {
    username: "",
  },
  token: "",
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...state, user: payload };
    case SET_TOKEN:
      return { ...state, token: payload };
    case SET_IS_SIGNEDIN:
      return { ...state, isSignedIn: payload };
    default:
      return state;
  }
};
