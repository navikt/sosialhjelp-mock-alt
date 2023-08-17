import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

const erLocalhost = () => {
    return process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === 'local';
};

export const getMockAltApiURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:8989/sosialhjelp/mock-alt-api';
    } else {
        return 'https://digisos.ekstern.dev.nav.no/sosialhjelp/mock-alt-api';
    }
};

export const getSoknadURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/soknad/informasjon';
    } else {
        return 'https://digisos.ekstern.dev.nav.no/sosialhjelp/soknad/informasjon';
    }
};

export const getInnsynURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/innsyn';
    } else {
        return 'https://digisos.ekstern.dev.nav.no/sosialhjelp/innsyn';
    }
};

export const getFagsystemmockURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/fagsystem-mock';
    } else {
        return 'https://digisos.ekstern.dev.nav.no/sosialhjelp/fagsystem-mock';
    }
};

export const getRedirectParams = (searchParams: ReadonlyURLSearchParams): string => {
    const cookiename = searchParams.get('cookiename');
    let redirect = searchParams.get('redirect');
    if (!redirect) {
        redirect = searchParams.get('redirect_uri');
    }
    if (!redirect) {
        redirect = searchParams.get('goto');
    }
    const expiry = searchParams.get('expiry');
    return cookiename
        ? '&cookiename=' + cookiename
        : '' + (redirect ? '&redirect=' + redirect : '') + (expiry ? '&expiry=' + expiry : '');
};

export const addParams = (params: string, firstChar: string = '?'): string => {
    return params.length > 0 ? firstChar + params : '';
};

export const isLoginSession = (params: string): boolean => {
    return params.indexOf('redirect=') > -1;
};
