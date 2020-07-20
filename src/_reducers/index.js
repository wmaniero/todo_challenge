import { combineReducers } from "redux";
import { homepage } from "./homepage.reducer";

const appReducer = combineReducers({
    homepage
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
