import { Metadata } from 'next';
import '../App.css';
import StyledComponentsRegistry from './lib/registry';
import React from 'react';
import { initInstrumentation } from '../faro/faro';

export const metadata: Metadata = {
    title: 'MockAlt - Oversikt',
    description: 'Mocking av Digisos-apper',
};

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    initInstrumentation();
    return (
        <html lang="nb">
            <head>
                <link
                    rel="preload"
                    href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                <StyledComponentsRegistry>
                    <div className="app">
                        <div className="container">{children}</div>
                    </div>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
