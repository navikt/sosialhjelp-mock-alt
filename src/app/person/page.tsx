import React, { Suspense } from 'react';
import { PersonMockData } from '../../components/person/PersonMockData';
import Loading from '../loading';

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <PersonMockData />
        </Suspense>
    );
}
