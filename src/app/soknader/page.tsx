'use client';
import React, { Suspense } from 'react';
import { Soknader } from '../../components/soknader/Soknader';
import Loading from '../loading';

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Soknader />
        </Suspense>
    );
}
