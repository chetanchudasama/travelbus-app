import { SET_LOADER } from "../actions/actionTypes";

export const loaderReducer = (state = false, action: any) => {
  switch (action.type) {
    case SET_LOADER:
      return action.payload;
    default:
      return state;
  }
};
