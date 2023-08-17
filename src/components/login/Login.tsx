import { Alert, Panel, Button, Heading } from '@navikt/ds-react';
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
import styled from 'styled-components';
import { Knappegruppe, StyledSelect } from '../../styling/Styles';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const StyledPanel = styled(Panel)`
    row-gap: 1rem;
    display: flex;
    flex-direction: column;
`;

const StyledLoginButton = styled(Button)`
    min-width: 7rem;
`;

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [personliste, setPersonListe] = useState<Personalia[]>([]);

    const [siteUrl, setSiteUrl] = useState('');
    const [redirect, setRedirect] = useState('');
    const searchParams = useSearchParams();
    const params = getRedirectParams(searchParams);
    const router = useRouter();

    useEffect(() => {
        setSiteUrl(window.location.origin);
        setRedirect(window.location.origin + '/sosialhjelp/mock-alt/login');
    }, []);

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
        router.replace(
            `${getMockAltApiURL()}/login/cookie?subject=${encodeURIComponent(
                fnr
            )}&issuerId=selvbetjening&audience=someaudience${queryString}`
        );
    };

    return (
        <StyledPanel>
            <Heading level="1" size="xlarge">
                Mock login
            </Heading>
            <Alert variant="warning">
                <Heading spacing size="xsmall" level="2">
                    DETTE ER KUN FOR TESTING!
                </Heading>
                Alt som gjøres i mock-miljø er tilgjengelig for alle. Ikke legg inn noe sensitiv informasjon!
            </Alert>
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
                    <option key="ingen" value={siteUrl + '/sosialhjelp/mock-alt/login'}>
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
                <StyledLoginButton variant="primary" onClick={() => handleOnClick()}>
                    Logg inn
                </StyledLoginButton>
                <Link
                    className="navds-button navds-button--secondary navds-button--medium"
                    href={'/person' + addParams(params)}
                    type="knapp"
                >
                    Opprett bruker
                </Link>
                <Link
                    className="navds-button navds-button--secondary navds-button--medium"
                    href={'/' + addParams(params)}
                >
                    Gå til oversikten
                </Link>
            </Knappegruppe>
        </StyledPanel>
    );
};
