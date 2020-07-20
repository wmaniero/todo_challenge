import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createFilter } from "redux-persist-transform-filter";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import rootReducer from "../_reducers";

const loggerMiddleware = createLogger();
const persistFilter = createFilter("homepage", ["recordedActions"]);

//Store keys to persist
const persistConfig = {
    key: "homepage",
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ["homepage"],
    transforms: [persistFilter]
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    (process.env.NODE_ENV === "development") ? 
        applyMiddleware(thunkMiddleware, loggerMiddleware) : 
        applyMiddleware(thunkMiddleware)
);
export const persistor = persistStore(store);