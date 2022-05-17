import { CLEAR, SET_USER } from "../actions/actionTypes";

export const userReducer = (state = {}, action: any) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case CLEAR:
      return {};
    default:
      return state;
  }
};
