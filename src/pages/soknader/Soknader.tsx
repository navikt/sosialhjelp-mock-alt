import Panel from 'nav-frontend-paneler';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { addParams, getMockAltApiURL, getRedirectParams } from '../../utils/restUtils';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

const StyledEksternLink = styled.a.attrs({ className: 'lenke' })`
    display: block;
`;

const LinkWithButtonStyle = styled(Link).attrs({ className: 'knapp knapp--standard' })`
    margin: 1rem 0.5rem 0 0;
`;

const StyledPanel = styled(Panel)`
    h1 {
        margin-bottom: 1rem;
    }
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

interface Vedlegg {
    navn: string;
    id: string;
    size: number;
    kanLastesned: boolean;
}

interface SoknadsInfo {
    sokerFnr: string;
    sokerNavn: string;
    fiksDigisosId: string;
    tittel: string;
    vedlegg: Vedlegg[];
    vedleggSomMangler: number;
}

export const Soknader = () => {
    const [soknadsliste, setSoknadsliste] = useState([]);
    const params = getRedirectParams();

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/mock-alt/soknad/liste`)
            .then((response) => response.json())
            .then((json) => setSoknadsliste(json));
    }, []);

    return (
        <StyledPanel>
            <Sidetittel>Søknader</Sidetittel>
            {soknadsliste?.length > 0 ? (
                <TabellWrapper>
                    <Tabell>
                        <thead>
                            <tr>
                                <th>Bruker</th>
                                <th>Tittel</th>
                                <th>Mer info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {soknadsliste.map((soknad: SoknadsInfo) => {
                                return (
                                    <tr key={soknad.fiksDigisosId}>
                                        <td>
                                            <div>{soknad.sokerNavn}</div>
                                            <div>Fnr: {soknad.sokerFnr}</div>
                                        </td>
                                        <td>
                                            <div>{soknad.tittel}</div>
                                            <div>Id: {soknad.fiksDigisosId}</div>
                                        </td>
                                        <MerInfo>
                                            <div>Id: {soknad.fiksDigisosId}</div>
                                            <div>Antal vedlegg: {soknad.vedlegg.length}</div>
                                            {soknad.vedleggSomMangler > 0 && (
                                                <b>* noen av vedleggene mangler ({soknad.vedleggSomMangler} stk)</b>
                                            )}
                                            <StyledEksternLink
                                                href={getMockAltApiURL() + '/mock-alt/soknad/' + soknad.fiksDigisosId}
                                            >
                                                Last ned som zip
                                            </StyledEksternLink>
                                        </MerInfo>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Tabell>
                </TabellWrapper>
            ) : (
                <Normaltekst>Fant ingen eksisterende testbrukere</Normaltekst>
            )}
            <LinkWithButtonStyle to={'/' + addParams(params)}>Til oversikten</LinkWithButtonStyle>
        </StyledPanel>
    );
};
