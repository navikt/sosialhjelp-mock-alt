import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { PersonMockData } from './pages/person/PersonMockData';
import { Login } from './pages/login/Login';
import { Oversikt } from './pages/Oversikt';
import { Feilkonfigurering } from './pages/feil/Feilkonfigurering';
import { Soknader } from './pages/soknader/Soknader';

function App() {
    return (
        <div id="app" className="app">
            <div className="container">
                <BrowserRouter basename="sosialhjelp/mock-alt">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/person" element={<PersonMockData />} />
                        <Route path="/feil" element={<Feilkonfigurering />} />
                        <Route path="/soknader" element={<Soknader />} />
                        <Route path="/" element={<Oversikt />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
