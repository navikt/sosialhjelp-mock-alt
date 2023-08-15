import React, { Suspense } from 'react';
import { Oversikt } from '../components/Oversikt';
import { getMockAltApiURL } from '../utils/restUtils';
import Loading from './loading';

async function getFnr() {
    const res = await fetch(`${getMockAltApiURL()}/fiks/fast/fnr`);
    return res.text();
}

async function getPersoner() {
    const res = await fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`, { next: { tags: ['personliste'] } });
    return res.json();
}

export default async function Page() {
    return <div>Test</div>;
    {
        /*
        const defaultFnr = await getFnr();
    const personliste = await getPersoner();

    return (
        <Suspense fallback={<Loading />}>
            <Oversikt mockAltDefaultFnr={defaultFnr} personliste={personliste} />
        </Suspense>
    );

    */
    }
}
