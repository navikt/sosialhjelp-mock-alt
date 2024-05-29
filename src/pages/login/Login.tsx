import { Alert, Button, Heading } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { addParams, getInnsynURL, getRedirectParams, getRedirectUrl, getSoknadURL } from '../../utils/restUtils';
import { Link } from 'react-router-dom';
import { Knappegruppe, StyledSelect } from '../../styling/Styles';
import { usePersonListe } from '../../generated/frontend-controller/frontend-controller';

export const Login = () => {
    const [valgtFnr, setValgtFnr] = useState<string>();
    const { data: personliste } = usePersonListe();
    useEffect(() => setValgtFnr(personliste?.[0].fnr), [personliste]);

    // Innsyn bruker fremdeles "redirect_uri", så vi konformerer tilbake til "redirect" her
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const legacy_redirect = query.get('redirect_uri') || query.get('goto');
        if (legacy_redirect) {
            query.delete('redirect_uri');
            query.delete('goto');
            query.set('redirect', legacy_redirect);
            window.location.search = query.toString();
        }
    }, []);

    const [redirect, setRedirect] = useState(window.location.origin + '/sosialhjelp/mock-alt/login');

    if (!valgtFnr || !personliste) return;

    const params = getRedirectParams();

    const handleOnClick = () => {
        const nextPage = getRedirectUrl(valgtFnr);
        if (!window.location.search.includes('redirect')) nextPage.searchParams.set('redirect', redirect);

        window.location.href = nextPage.href;
    };

    return (
        <div className={'flex flex-col gap-4'}>
            <Heading level="2" size="large">
                Logg inn
            </Heading>
            <Alert variant="warning" className={'mb-2'}>
                <Heading spacing size="small" level="3">
                    DETTE ER KUN FOR TESTING!
                </Heading>
                Alt som gjøres i mock-miljø er tilgjengelig for alle. Ikke legg inn noe sensitiv informasjon!
            </Alert>
            <StyledSelect onChange={(event) => setValgtFnr(event.target.value)} label="Velg bruker" value={valgtFnr}>
                {personliste.map(({ fnr, navn }) => (
                    <option key={fnr} value={fnr}>
                        {`${navn.fornavn} ${navn.mellomnavn} ${navn.etternavn} (${fnr})`}
                    </option>
                ))}
            </StyledSelect>
            {!window.location.search.includes('redirect') && (
                <StyledSelect
                    onChange={(event) => setRedirect(event.target.value)}
                    label="Velg tjeneste"
                    value={redirect}
                >
                    <option key="ingen" value={window.location.origin + '/sosialhjelp/mock-alt/login'}>
                        Bli her
                    </option>
                    <option key="soknaden" value={getSoknadURL()}>
                        Søknaden
                    </option>
                    <option key="innsyn" value={getInnsynURL()}>
                        Innsyn
                    </option>
                </StyledSelect>
            )}
            <Knappegruppe>
                <Button variant="primary" onClick={() => handleOnClick()}>
                    Logg inn
                </Button>
                <Link to={'/person' + addParams(params)}>
                    <Button variant={'secondary'}>Opprett bruker</Button>
                </Link>
                <Link
                    className="navds-button navds-button--secondary navds-button--medium"
                    to={'/' + addParams(params)}
                >
                    Gå til oversikten
                </Link>
            </Knappegruppe>
        </div>
    );
};
