import { SET_USER, CLEAR } from "./actionTypes";

export const setUser = (userData: any) => {
  return {
    type: SET_USER,
    payload: userData,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR,
  };
};
