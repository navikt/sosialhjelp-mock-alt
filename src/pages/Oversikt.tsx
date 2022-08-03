import React, { useEffect, useState } from 'react';
import { addParams, getMockAltApiURL, getRedirectParams } from '../utils/restUtils';
import { Personalia } from './person/PersonMockData';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Bold } from '../styling/Styles';
import { BodyShort, Panel, Heading } from '@navikt/ds-react';

const StyledLink = styled(Link).attrs({ className: 'navds-link' })`
    margin-right: 1rem;
`;

const SoknaderLink = styled(Link).attrs({ className: 'navds-link' })`
    display: block;
    margin-top: 2rem;
    width: fit-content;
`;

const LinkWithButtonStyle = styled(Link).attrs({
    className: 'navds-button navds-button--secondary navds-button--medium',
})`
    margin: 0 0.5rem 0 0;
`;

const StyledPanel = styled(Panel)`
    margin-bottom: 3rem;
`;

const TabellWrapper = styled.div`
    overflow: auto;
`;

const Tabell = styled.table`
    border-collapse: collapse;
    display: block;
    overflow-x: auto;
    text-align: left;
    margin-bottom: 2rem;
    max-width: 90vw;

    tr:nth-child(odd) td {
        background: rgba(0, 0, 0, 0.03);
    }
    thead th {
        border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    }
    tbody td {
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }
    th,
    td {
        padding: 1rem;
    }
`;

const MerInfo = styled.td`
    display: flex;
    flex-direction: column;
    > *:not(:last-child) {
        margin-bottom: 0.5rem;
    }
`;

export const Oversikt = () => {
    const [personliste, setPersonListe] = useState([]);
    const [mockAltDefaultFnr, setMockAltDefaultFnr] = useState<string | undefined>(undefined);
    const checkmark = '✔';
    const params = getRedirectParams();

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setMockAltDefaultFnr(text);
            });
        fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`)
            .then((response) => response.json())
            .then((json) => setPersonListe(json));
    }, []);

    return (
        <StyledPanel>
            <Heading level="1" size="xlarge" spacing>
                Testbrukere - oversikt
            </Heading>
            {personliste?.length > 0 ? (
                <TabellWrapper>
                    <Tabell>
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Fnr</th>
                                <th>Mer info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personliste.map((bruker: Personalia) => {
                                return (
                                    <tr key={bruker.fnr}>
                                        <td>{`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn}`}</td>
                                        <td>{bruker.fnr}</td>
                                        <MerInfo>
                                            <StyledLink to={'/person?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                                {bruker.locked ? 'Detaljer' : 'Rediger'}
                                            </StyledLink>
                                            <StyledLink to={'/feil?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                                Feilsituasjoner
                                            </StyledLink>
                                            {mockAltDefaultFnr === bruker.fnr && <Bold>{checkmark} Default</Bold>}
                                        </MerInfo>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Tabell>
                </TabellWrapper>
            ) : (
                <BodyShort>Fant ingen eksisterende testbrukere</BodyShort>
            )}
            <LinkWithButtonStyle to={'/person' + addParams(params)}>Opprett bruker</LinkWithButtonStyle>
            <LinkWithButtonStyle to={'/login' + addParams(params)}>Logg inn</LinkWithButtonStyle>
            <SoknaderLink to={'/soknader' + addParams(params)}>Søknader</SoknaderLink>
        </StyledPanel>
    );
};
