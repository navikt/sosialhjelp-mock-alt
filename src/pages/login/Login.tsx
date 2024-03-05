import { Alert, Button, Heading } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import {
    addParams,
    getInnsynURL,
    getMockAltApiURL,
    getRedirectParams,
    getSoknadURL,
    isLoginSession,
} from '../../utils/restUtils';
import { Personalia } from '../person/PersonMockData';
import { Link } from 'react-router-dom';
import { Knappegruppe, StyledSelect } from '../../styling/Styles';

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [redirect, setRedirect] = useState(window.location.origin + '/sosialhjelp/mock-alt/login');
    const [personliste, setPersonListe] = useState<Personalia[]>([]);

    const params = getRedirectParams();

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setFnr(text);
            });
        fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`)
            .then((response) => response.json())
            .then((json) => setPersonListe(json));
    }, []);

    const handleOnClick = () => {
        var queryString = addParams(params, '&');
        if (!isLoginSession(params)) {
            queryString = '&redirect=' + encodeURIComponent(redirect);
        }
        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${encodeURIComponent(
            fnr
        )}&issuerId=selvbetjening&audience=someaudience${queryString}`;
    };

    return (
        <div className={'flex flex-col gap-4'}>
            <Heading level="2" size="large">
                Logg inn
            </Heading>
            <Alert variant="warning" className={'dark:text-gray-900 mb-2'}>
                <Heading spacing size="small" level="3">
                    DETTE ER KUN FOR TESTING!
                </Heading>
                Alt som gjøres i mock-miljø er tilgjengelig for alle. Ikke legg inn noe sensitiv informasjon!
            </Alert>
            <StyledSelect onChange={(event) => setFnr(event.target.value)} label="Velg bruker" value={fnr}>
                {personliste.map((bruker) => (
                    <option key={bruker.fnr} value={bruker.fnr}>
                        {`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn} (${bruker.fnr})`}
                    </option>
                ))}
            </StyledSelect>
            {!isLoginSession(params) && (
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
                <Link
                    className="navds-button navds-button--secondary navds-button--medium"
                    to={'/person' + addParams(params)}
                    type="knapp"
                >
                    Opprett bruker
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
