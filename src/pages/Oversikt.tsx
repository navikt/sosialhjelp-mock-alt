import React, { useEffect, useState } from 'react';
import { addParams, getMockAltApiURL, getRedirectParams } from '../utils/restUtils';
import { Personalia } from './person/PersonMockData';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bold } from '../styling/Styles';
import { BodyLong, Panel, Heading, Link as NavDsLink, Table, Button } from '@navikt/ds-react';
import { QuestionmarkDiamondIcon } from '@navikt/aksel-icons';
const VeiledningLenke = styled(NavDsLink)`
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    width: fit-content;
`;
const StyledLink = styled(Link).attrs({ className: 'navds-link' })`
    margin-right: 1rem;
`;

const StyledPanel = styled(Panel)`
    margin-bottom: 3rem;
    min-height: 85vh;
`;

export const Oversikt = () => {
    const navigate = useNavigate();
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
        <StyledPanel>
            <Heading level="1" size="xlarge" spacing>
                Testbrukere - oversikt
            </Heading>
            {personliste?.length > 0 ? (
                <Table zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Navn</Table.HeaderCell>
                            <Table.HeaderCell>Fnr</Table.HeaderCell>
                            <Table.HeaderCell>Mer info</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {personliste.map((bruker: Personalia) => (
                            <Table.Row key={bruker.fnr}>
                                <Table.DataCell>{`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn}`}</Table.DataCell>
                                <Table.DataCell>{bruker.fnr}</Table.DataCell>
                                <Table.DataCell>
                                    <StyledLink to={'/person?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                        {bruker.locked ? 'Detaljer' : 'Rediger'}
                                    </StyledLink>
                                    <StyledLink to={'/feil?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                        Feilsituasjoner
                                    </StyledLink>
                                    {mockAltDefaultFnr === bruker.fnr && <Bold>✔ Default</Bold>}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <BodyLong spacing>Fant ingen eksisterende testbrukere</BodyLong>
            )}
            <div className={'flex gap-4 py-4'}>
                <Button onClick={() => navigate(`person${addParams(params)}`)}>Opprett bruker</Button>
                <Button onClick={() => navigate(`login${addParams(params)}`)}>Logg inn</Button>
            </div>

            <Link to={`soknader${addParams(params)}`}>Søknader</Link>
            <VeiledningLenke href="https://www.nav.no/_/attachment/download/ea62eacf-78a1-4a7a-baed-796f5617c36f:e246ea09b53b232abedb4e2acd96c28572d3c023/Veiledning%20for%20testmilj%C3%B8et%20for%20digital%20s%C3%B8knad%20og%20innsyn.pdf">
                <QuestionmarkDiamondIcon fontSize="1.5rem" /> Veiledning for testmiljøet (pdf)
            </VeiledningLenke>
        </StyledPanel>
    );
};
