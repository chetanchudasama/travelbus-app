import { combineReducers } from "redux";
import { userReducer } from "./user";
import { loaderReducer } from "./loader";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage, // used local-storage
  whitelist: ["user"], // add reducers name you want to persistance
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  user: userReducer,
  loader: loaderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
// @ts-ignore
export default persistReducer<RootState>(persistConfig, rootReducer);
