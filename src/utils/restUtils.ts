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
