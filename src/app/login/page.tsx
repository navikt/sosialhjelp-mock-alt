import React, { Suspense } from 'react';
import { Login } from '../../components/login/Login';
import Loading from '../loading';
import { getMockAltApiURL } from '../../utils/restUtils';

async function getFnr() {
    const res = await fetch(`${getMockAltApiURL()}/fiks/fast/fnr`);
    return await res.text();
}

async function getPersoner() {
    const res = await fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`);
    return await res.json();
}

export default async function Page() {
    const defaultFnr = await getFnr();
    const personliste = await getPersoner();

    return (
        <Suspense fallback={<Loading />}>
            <Login defaultFnr={defaultFnr} personliste={personliste} />
        </Suspense>
    );
}
