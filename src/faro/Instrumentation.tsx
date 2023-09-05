'use client';

import { useEffect } from 'react';
import { initInstrumentation } from './faro';

export default function Instrumentation() {
    useEffect(() => {
        initInstrumentation();
    });
    return <></>;
}
