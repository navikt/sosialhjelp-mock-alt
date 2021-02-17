import Panel from 'nav-frontend-paneler';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { addParams, getMockAltApiURL, getRedirectParams } from '../utils/restUtils';
import { Personalia } from './person/PersonMockData';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import 'nav-frontend-tabell-style/src/index.less';

const StyledLink = styled(Link).attrs({ className: 'lenke' })`
    margin-right: 1rem;
`;

const LinkWithButtonStyle = styled(Link).attrs({ className: 'knapp knapp--standard' })`
    margin: 1rem 0.5rem 0 0;
`;

const StyledPanel = styled(Panel)`
    h1 {
        margin-bottom: 1rem;
    }
`;

const Bold = styled.span`
    font-weight: bold;
`;

const Tabell = styled.table`
    border-collapse: collapse;
    display: table;
    overflow-x: scroll;
    text-align: left;
    margin-bottom: 2rem;

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

export const Oversikt = () => {
    const [personliste, setPersonListe] = useState([]);
    const [mockAltDefaultFnr, setMockAltDefaultFnr] = useState<string | undefined>(undefined);

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
        <StyledPanel border>
            <Sidetittel>Testbrukere - oversikt</Sidetittel>
            {personliste?.length > 0 ? (
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
                                    <td>{`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn}
                                 `}</td>
                                    <td>{bruker.fnr}</td>
                                    <td>
                                        <StyledLink to={'/person?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                            {bruker.locked ? 'Se på' : 'Edit'}
                                        </StyledLink>
                                        <StyledLink to={'/feil?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                            Feil?
                                        </StyledLink>
                                        {mockAltDefaultFnr === bruker.fnr && <Bold>Default</Bold>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Tabell>
            ) : (
                <Normaltekst>Fant ingen eksisterende testbrukere</Normaltekst>
            )}
            <LinkWithButtonStyle to={'/person' + addParams(params)}>Opprett ny bruker</LinkWithButtonStyle>
            <LinkWithButtonStyle to={'/login' + addParams(params)}>Logg inn og gå til tjenestene</LinkWithButtonStyle>
        </StyledPanel>
    );
};
