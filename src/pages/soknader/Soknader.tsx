import React, { useEffect, useState } from 'react';
import { addParams, getFagsystemmockURL, getMockAltApiURL, getRedirectParams } from '../../utils/restUtils';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BodyShort, Button, Panel, Heading } from '@navikt/ds-react';

const StyledEksternLink = styled.a.attrs({ className: 'navds-link' })`
    display: block;
`;

const StyledLink = styled(Link).attrs({ className: 'navds-link' })`
    margin: 2rem 0.5rem 0 0;
    display: block;
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

const SeMerKnap = styled(Button)`
    margin: 0 auto;
    display: block;
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

const DEFAULT_ANTALL_VIST = 10;

export const Soknader = () => {
    const [soknadsliste, setSoknadsliste] = useState<SoknadsInfo[]>([]);
    const params = getRedirectParams();
    const [antallVist, setAntallVist] = useState(DEFAULT_ANTALL_VIST);

    const onSeMerClicked = () => {
        setAntallVist(antallVist + DEFAULT_ANTALL_VIST);
    };

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/mock-alt/soknad/liste`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response;
            })
            .then((response) => response.json())
            .then((json) => {
                setSoknadsliste(json);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Panel>
            <Heading level="1" size="xlarge" spacing>
                Søknader
            </Heading>
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
                            {soknadsliste.slice(0, antallVist).map((soknad: SoknadsInfo) => {
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
                                            <div>Antal vedlegg: {soknad.vedlegg.length}</div>
                                            {soknad.vedleggSomMangler > 0 && (
                                                <b>* noen av vedleggene mangler ({soknad.vedleggSomMangler} stk)</b>
                                            )}
                                            <StyledEksternLink
                                                href={
                                                    getMockAltApiURL() +
                                                    '/mock-alt/soknad/' +
                                                    encodeURIComponent(soknad.fiksDigisosId)
                                                }
                                            >
                                                Last ned soknad-zip
                                            </StyledEksternLink>
                                            <StyledEksternLink
                                                href={
                                                    getMockAltApiURL() +
                                                    '/mock-alt/ettersendelse/' +
                                                    encodeURIComponent(soknad.fiksDigisosId)
                                                }
                                            >
                                                Last ned ettersendelse-zip
                                            </StyledEksternLink>
                                            <StyledEksternLink
                                                href={encodeURI(
                                                    getFagsystemmockURL() +
                                                        '/?fiksDigisosId=' +
                                                        encodeURIComponent(soknad.fiksDigisosId)
                                                )}
                                            >
                                                Åpne i "fagsystem"
                                            </StyledEksternLink>
                                        </MerInfo>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Tabell>
                </TabellWrapper>
            ) : (
                <BodyShort>Fant ingen søknader</BodyShort>
            )}
            {soknadsliste?.length > antallVist && (
                <SeMerKnap size="s" onClick={onSeMerClicked}>
                    Se flere
                </SeMerKnap>
            )}
            <StyledLink to={'/' + addParams(params)}>Til oversikten</StyledLink>
        </Panel>
    );
};
