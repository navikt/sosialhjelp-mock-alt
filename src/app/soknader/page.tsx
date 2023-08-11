import React, { Suspense } from 'react';
import { Soknader } from '../../components/soknader/Soknader';
import Loading from '../loading';
import { getMockAltApiURL } from '../../utils/restUtils';

async function getSoknader() {
    const res = await fetch(`${getMockAltApiURL()}/mock-alt/soknad/liste`);

    if (!res.ok) {
        throw new Error('HTTP error ' + res.status);
    }

    return res.json();
}
export default async function Page() {
    const soknadslise = await getSoknader();

    return (
        <Suspense fallback={<Loading />}>
            <Soknader soknadsliste={soknadslise} />
        </Suspense>
    );
}
