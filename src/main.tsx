import React from 'react';
import './main.css';
import reportWebVitals from './reportWebVitals';
import '@navikt/ds-css';
import { createRoot } from 'react-dom/client';
import { Heading } from '@navikt/ds-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { PersonMockData } from './pages/person/PersonMockData';
import { Feilkonfigurering } from './pages/feil/Feilkonfigurering';
import { Soknader } from './pages/soknader/Soknader';
import { Oversikt } from './pages/Oversikt';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <div className={'w-full max-w-5xl mx-auto p-8'}>
            <Heading level={'1'} size={'xlarge'} spacing>
                Sosialhjelp mock
            </Heading>
            <BrowserRouter basename="sosialhjelp/mock-alt">
                <Routes>
                    <Route path="/internal/isAlive" element={<div>isAlive</div>} />
                    <Route path="/internal/isReady" element={<div>isAlive</div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/person" element={<PersonMockData />} />
                    <Route path="/feil" element={<Feilkonfigurering />} />
                    <Route path="/soknader" element={<Soknader />} />
                    <Route path="/" element={<Oversikt />} />
                </Routes>
            </BrowserRouter>
        </div>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
