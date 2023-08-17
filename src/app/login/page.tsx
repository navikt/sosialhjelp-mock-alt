'use client';

import React, { Suspense } from 'react';
import { Login } from '../../components/login/Login';
import Loading from '../loading';

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>
    );
}
