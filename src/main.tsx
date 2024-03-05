import React from 'react';
import './main.css';
import reportWebVitals from './reportWebVitals';
import '@navikt/ds-css';
import { createRoot } from 'react-dom/client';
import { Heading } from '@navikt/ds-react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { PersonMockData } from './pages/person/PersonMockData';
import { Feilkonfigurering } from './pages/feil/Feilkonfigurering';
import { Soknader } from './pages/soknader/Soknader';
import { Oversikt } from './pages/Oversikt';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <div className={'bg-white dark:bg-gray-800 dark:text-bg-subtle min-h-[100dvh]'}>
            <div className={''}>
                <BrowserRouter basename="sosialhjelp/mock-alt">
                    <header className={'bg-blue-50'}>
                        <div className={'w-full max-w-5xl mx-auto p-8 '}>
                            <Heading level={'1'} size={'xlarge'} spacing>
                                Sosialhjelp mock
                            </Heading>
                            <nav className={'flex gap-4 underline font-bold text-xl'}>
                                <Link to={'/'}>Brukere</Link>
                                <Link to={'/soknader'}>Søknader</Link>
                                <Link to={`/person`}>Opprett bruker</Link>
                                <Link to={`/login`}>Logg inn</Link>
                            </nav>
                        </div>
                    </header>
                    <main className={'p-8 w-full max-w-5xl mx-auto'}>
                        <Routes>
                            <Route path="/internal/isAlive" element={<div>isAlive</div>} />
                            <Route path="/internal/isReady" element={<div>isAlive</div>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/person" element={<PersonMockData />} />
                            <Route path="/feil" element={<Feilkonfigurering />} />
                            <Route path="/soknader" element={<Soknader />} />
                            <Route index element={<Oversikt />} />
                            <Route path="*" element={<div>404</div>} />
                        </Routes>
                    </main>
                </BrowserRouter>
            </div>
        </div>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
