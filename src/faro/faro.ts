import { Faro, initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';

let faro: Faro | null = null;
export function initInstrumentation(): void {
    console.log('faro', faro);
    if (typeof window === 'undefined' || faro !== null) return;

    getFaro();
}

export function getFaro(): Faro {
    console.log({ faro });
    if (faro != null) return faro;

    faro = initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'sosialhjelp-mock-alt',
        },
        instrumentations: [
            ...getWebInstrumentations({
                captureConsole: false,
            }),
        ],
    });
    console.log('faro etter init', faro);

    return faro;
}
