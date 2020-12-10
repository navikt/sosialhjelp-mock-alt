import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { SoknadMock } from './pages/SoknadMock';
import { Login } from './pages/login/Login';

function App() {
    return (
        <div id="app" className="app">
            <div className="container">
                <Router basename="sosialhjelp/mock-alt">
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/">
                            <SoknadMock />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
