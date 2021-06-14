import { Hovedknapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
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
import styled from 'styled-components/macro';
import { Knappegruppe, StyledSelect } from '../../styling/Styles';
import AlertStripe from 'nav-frontend-alertstriper';

const StyledPanel = styled(Panel)`
    h1 {
        margin-bottom: 1rem;
    }
`;

const StyledAlertStripe = styled(AlertStripe)`
    margin-bottom: 1rem;
`;

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [redirect, setRedirect] = useState(getSoknadURL());
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
            queryString = '&redirect=' + redirect;
        }
        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}&issuerId=selvbetjening&audience=someaudience${queryString}`;
    };

    return (
        <StyledPanel>
            <Sidetittel>Mock login</Sidetittel>
            <StyledAlertStripe type="advarsel">
                DETTE ER KUN FOR TESTING! Alt som gjøres i mock-miljø er tilgjengelig for alle. Ikke legg inn noe
                sensitiv informasjon!
            </StyledAlertStripe>
            <StyledSelect onChange={(event) => setFnr(event.target.value)} label="Velg bruker" value={fnr}>
                {personliste.map((bruker) => {
                    return (
                        <option key={bruker.fnr} value={bruker.fnr}>
                            {`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn} (${bruker.fnr})`}
                        </option>
                    );
                })}
            </StyledSelect>
            {!isLoginSession(params) && (
                <StyledSelect
                    onChange={(event) => setRedirect(event.target.value)}
                    label="Velg tjeneste"
                    value={redirect}
                >
                    <option key="soknaden" value={getSoknadURL()}>
                        Søknaden
                    </option>
                    <option key="innsyn" value={getInnsynURL()}>
                        Innsyn
                    </option>
                    <option key="ingen" value={window.location.origin + '/sosialhjelp/mock-alt/'}>
                        Gå tilbake til oversikten
                    </option>
                </StyledSelect>
            )}
            <Knappegruppe>
                <Hovedknapp onClick={() => handleOnClick()}>Login</Hovedknapp>
                <Link className="knapp" to={'/person' + addParams(params)} type="knapp">
                    Opprett bruker
                </Link>
                <Link className="knapp" to={'/' + addParams(params)}>
                    Gå til oversikten
                </Link>
            </Knappegruppe>
        </StyledPanel>
    );
};
