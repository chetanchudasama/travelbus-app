import { SET_LOADER } from "./actionTypes";

export const setLoader = (bool: any) => {
  return {
    type: SET_LOADER,
    payload: bool,
  };
};
