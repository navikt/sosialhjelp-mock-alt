export const erLocalhost = () =>
    window.location.origin.indexOf('localhost:') > -1 || window.location.origin.indexOf('127.0.0.1:') > -1;

export const getMockAltApiURL = () =>
    erLocalhost()
        ? 'http://localhost:8989/sosialhjelp/mock-alt-api'
        : 'https://digisos.ekstern.dev.nav.no/sosialhjelp/mock-alt-api';

export const getSoknadURL = () =>
    erLocalhost()
        ? 'http://localhost:3000/sosialhjelp/soknad/informasjon'
        : 'https://digisos.ekstern.dev.nav.no/sosialhjelp/soknad/informasjon';

export const getInnsynURL = () =>
    erLocalhost()
        ? 'http://localhost:3000/sosialhjelp/innsyn'
        : 'https://digisos.ekstern.dev.nav.no/sosialhjelp/innsyn';

export const getFagsystemmockURL = () =>
    erLocalhost()
        ? 'http://localhost:3000/sosialhjelp/fagsystem-mock'
        : 'https://digisos.ekstern.dev.nav.no/sosialhjelp/fagsystem-mock';

export const getRedirectParams = (): string => {
    const query = new URLSearchParams(window.location.search);

    const expiry = query.get('expiry');
    const cookieName = query.get('cookiename');
    const redirect = query.get('redirect') || query.get('redirect_uri') || query.get('goto');

    const newQuery = new URLSearchParams();
    if (cookieName) newQuery.set('cookiename', cookieName);
    if (redirect) newQuery.set('redirect', redirect);
    if (expiry) newQuery.set('expiry', expiry);
    return '&' + newQuery.toString();
};

const REDIRECT_SEARCH_PARAM_KEYS = ['cookiename', 'expiry', 'redirect'] as const;

export const getRedirectUrl = (personident: string) => {
    const url = new URL(`${getMockAltApiURL()}/login/cookie`);
    const query = new URLSearchParams(window.location.search);

    url.searchParams.append('subject', personident);
    url.searchParams.append('issuerId', 'selvbetjening');
    url.searchParams.append('audience', 'someaudience');

    REDIRECT_SEARCH_PARAM_KEYS.forEach((key) => {
        const value = query.get(key);
        if (value) url.searchParams.append(key, value);
    });

    return url;
};

export const addParams = (params: string | null = null, firstChar: string = '?'): string => {
    const returnParams = params || getRedirectParams();
    return returnParams.length > 0 ? firstChar + returnParams : '';
};

export const isLoginSession = (params: string | null = null) =>
    (params || getRedirectParams()).indexOf('redirect=') > -1;
