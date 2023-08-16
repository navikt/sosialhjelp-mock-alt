'use client';

import React, { Suspense } from 'react';
import { Oversikt } from '../components/Oversikt';
import Loading from './loading';

export default async function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Oversikt />
        </Suspense>
    );
}
