'use client';

import React, { Suspense } from 'react';
import { Feilkonfigurering } from '../../components/feil/Feilkonfigurering';
import Loading from '../loading';

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Feilkonfigurering />
        </Suspense>
    );
}
