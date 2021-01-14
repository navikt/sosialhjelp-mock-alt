const erDevGcp = () => {
    return window.location.origin === 'https://digisos-gcp.dev.nav.no';
};

const erLabsGcp = () => {
    return window.location.origin === 'https://digisos.labs.nais.io';
};

export const getMockAltApiURL = () => {
    if (erDevGcp()) {
        return 'https://digisos-gcp.dev.nav.no/sosialhjelp/mock-alt-api';
    } else if (erLabsGcp()) {
        return 'https://digisos.labs.nais.io/sosialhjelp/mock-alt-api';
    } else {
        return 'http://localhost:8989/sosialhjelp/mock-alt-api';
    }
};

export const getRedirectParams = (): string => {
    const query = new URLSearchParams(window.location.search);
    const cookiename = query.get("cookiename");
    const redirect = query.get("redirect");
    const expiry = query.get("expiry");
    return cookiename ? "&cookiename=" + cookiename : ""
        + (redirect ? "&redirect=" + redirect : "")
        + (expiry ? "&cookiename=" + expiry : "")
};

export const addParams = (params: string | null = null, firstChar: string = "?"): string => {
    let returnParams = params;
    if (!returnParams) {
        returnParams = getRedirectParams();
    }
    return returnParams.length > 0 ? firstChar + returnParams : ""
}

export const isLoginSession = (params: string | null = null): boolean => {
    let returnParams = params;
    if (!returnParams) {
        returnParams = getRedirectParams();
    }
    return returnParams.indexOf("redirect=") > -1
}
