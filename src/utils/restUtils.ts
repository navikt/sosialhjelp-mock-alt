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

type RedirectParams = {
    cookiename?: string;
    redirect?: string;
    expiry?: string;
};

export const getRedirectParamsAsObject = (): RedirectParams => {
    const query = new URLSearchParams(window.location.search);
    return {
        expiry: query.get('expiry') || undefined,
        cookiename: query.get('cookiename') || undefined,
        redirect: query.get('redirect') || undefined,
    };
};

export const getRedirectUrl = (personident: string) => {
    const url = new URL(`${getMockAltApiURL()}/login/cookie`);
    url.searchParams.append('subject', personident);
    url.searchParams.append('issuerId', 'selvbetjening');
    url.searchParams.append('audience', 'someaudience');
    for (const [key, value] of Object.entries(getRedirectParamsAsObject())) {
        if (value) url.searchParams.append(key, value);
    }
    return url;
};

export const addParams = (params: string | null = null, firstChar: string = '?'): string => {
    const returnParams = params || getRedirectParams();
    return returnParams.length > 0 ? firstChar + returnParams : '';
};

export const isLoginSession = (params: string | null = null) =>
    (params || getRedirectParams()).indexOf('redirect=') > -1;
