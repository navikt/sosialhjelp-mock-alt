const erDevGcp = () => {
    return window.location.origin === 'https://digisos-gcp.dev.nav.no';
};

const erLocalhost = () => {
    return window.location.origin.indexOf('localhost:') > -1;
};

export const getMockAltApiURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:8989/sosialhjelp/mock-alt-api';
    } else if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/mock-alt-api';
    } else {
        return 'https://digisos.labs.nais.io/sosialhjelp/mock-alt-api';
    }
};

export const getSoknadURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/soknad/informasjon';
    } else if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/soknad/informasjon';
    } else {
        return 'https://digisos.labs.nais.io/sosialhjelp/soknad/informasjon';
    }
};

export const getInnsynURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/innsyn';
    } else if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/innsyn';
    } else {
        return 'https://digisos.labs.nais.io/sosialhjelp/innsyn';
    }
};

export const getModiaURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3003/sosialhjelp/modia';
    } else if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/modia';
    } else {
        return 'https://digisos.labs.nais.io/sosialhjelp/modia';
    }
};

export const getFagsystemmockURL = () => {
    if (erLocalhost()) {
        return 'http://localhost:3000/sosialhjelp/fagsystem-mock';
    } else if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/fagsystem-mock';
    } else {
        return 'https://digisos.labs.nais.io/sosialhjelp/fagsystem-mock';
    }
};

export const getRedirectParams = (): string => {
    const query = new URLSearchParams(window.location.search);
    const cookiename = query.get('cookiename');
    const redirect = query.get('redirect');
    const expiry = query.get('expiry');
    return cookiename
        ? '&cookiename=' + cookiename
        : '' + (redirect ? '&redirect=' + redirect : '') + (expiry ? '&expiry=' + expiry : '');
};

export const addParams = (params: string | null = null, firstChar: string = '?'): string => {
    let returnParams = params;
    if (!returnParams) {
        returnParams = getRedirectParams();
    }
    return returnParams.length > 0 ? firstChar + returnParams : '';
};

export const isLoginSession = (params: string | null = null): boolean => {
    let returnParams = params;
    if (!returnParams) {
        returnParams = getRedirectParams();
    }
    return returnParams.indexOf('redirect=') > -1;
};
