import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { history, buildURI } from "../_helpers";
import { GLOBALS } from "../_config";
import CookieConsent from "react-cookie-consent";

//Views
import {
    Homepage,
} from "../Views";

//Styles
import "../_assets/css/global.css";

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Router history={history} basename={GLOBALS.DEPLOYMENT_PATH}>
                    <Switch>
                        <Route exact path={buildURI("/")} component={Homepage} />
                        <Route path={buildURI("/homepage")} component={Homepage} />
                    </Switch>
                </Router>

                <CookieConsent
                    location="bottom"
                    buttonText="Ok, continua la navigazione"
                    cookieName="TECH_COOKIE"
                    style={{ background: "#2B373B" }}
                    buttonStyle={{ 
                        color: "#4e503b", 
                        fontSize: "13px" 
                    }}
                    expires={365}>
                    Questo sito Web utilizza i cookie per migliorare l'esperienza dell'utente.
                </CookieConsent>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

function mapDispatchToProps(dispatch) {
    return {
        
    };
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App };
