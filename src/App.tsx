import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { PersonMockData } from './pages/person/PersonMockData';
import { Login } from './pages/login/Login';
import { Oversikt } from './pages/Oversikt';
import { Feilkonfiurering } from './pages/feil/Feilkonfiurering';
import { Soknader } from './pages/soknader/Soknader';

function App() {
    return (
        <div id="app" className="app">
            <div className="container">
                <Router basename="sosialhjelp/mock-alt">
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/person">
                            <PersonMockData />
                        </Route>
                        <Route path="/feil">
                            <Feilkonfiurering />
                        </Route>
                        <Route path="/soknader">
                            <Soknader />
                        </Route>
                        <Route path="/">
                            <Oversikt />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
