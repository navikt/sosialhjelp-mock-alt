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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { logWarning } from './generated/frontend-logg-controller/frontend-logg-controller';
import { SoknadView } from './pages/soknad/SoknadView';

const container = document.getElementById('root');
const root = createRoot(container!);
const queryClient = new QueryClient();
const query = new URLSearchParams(window.location.search);

// Ser at redirect_uri og goto er støttede synonymer for "redirect" i Login.tsx/getRedirectParams.
// Antakeligvis er det ingen som bruker dem, men jeg vil ikke fjerne det før vi er sikre.
if (query.get('redirect_uri') || query.get('goto')) {
    logWarning({ message: 'Joda, bruk av redirect_uri eller goto forekommer' });
}

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <div className={'bg-white dark:bg-gray-800 dark:text-bg-subtle min-h-[100dvh]'}>
                <div className={''}>
                    <BrowserRouter basename="sosialhjelp/mock-alt">
                        <header className={'bg-blue-50 dark:bg-blue-800'}>
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
                                <Route path="/soknader/:soknadId" element={<SoknadView />} />
                                <Route path="/soknader" element={<Soknader />} />
                                <Route index element={<Oversikt />} />
                                <Route path="*" element={<div>404</div>} />
                            </Routes>
                        </main>
                    </BrowserRouter>
                </div>
            </div>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
