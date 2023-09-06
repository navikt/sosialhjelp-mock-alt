import { Faro, initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';

let faro: Faro | null = null;
export function initInstrumentation(): void {
    if (typeof window === 'undefined' || faro !== null) return;

    getFaro();
}

export function getFaro(): Faro | null {
    if (process.env.NEXT_PUBLIC_TELEMETRY_URL == null) return null;

    if (faro != null) return faro;
    faro = initializeFaro({
        url: process.env.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'sosialhjelp-mock-alt',
        },
        paused: process.env.NODE_ENV !== 'production',
        instrumentations: [
            ...getWebInstrumentations({
                captureConsole: false,
            }),
        ],
    });

    return faro;
}
