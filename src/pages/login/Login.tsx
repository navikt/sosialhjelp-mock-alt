import { Alert, Panel, Button, Title } from '@navikt/ds-react';
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

const StyledAlertStripe = styled(Alert)`
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
        <Panel>
            <Title level={1} size="2xl" spacing>
                Mock login
            </Title>
            <StyledAlertStripe variant="warning">
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
                <Button variant="action" onClick={() => handleOnClick()}>
                    Login
                </Button>
                <Link
                    className="navds-button navds-button--m navds-body-short"
                    to={'/person' + addParams(params)}
                    type="knapp"
                >
                    Opprett bruker
                </Link>
                <Link className="navds-button navds-button--m navds-body-short" to={'/' + addParams(params)}>
                    Gå til oversikten
                </Link>
            </Knappegruppe>
        </Panel>
    );
};
