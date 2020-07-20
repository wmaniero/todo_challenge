import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { App } from "./App";
import { store, persistor } from "./_helpers";
import * as serviceWorker from "./serviceWorker";
import { PersistGate } from "redux-persist/integration/react";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
