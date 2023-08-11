'use client';

import React from 'react';
import { addParams, getRedirectParams } from '../utils/restUtils';
import { Personalia } from './person/PersonMockData';
import styled from 'styled-components';
import { Bold } from '../styling/Styles';
import { BodyLong, Panel, Heading, Link as NavDsLink } from '@navikt/ds-react';
import { QuestionmarkDiamondIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const VeiledningLenke = styled(NavDsLink)`
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    width: fit-content;
`;
const StyledLink = styled(Link).attrs({ className: 'navds-link' })`
    margin-right: 1rem;
`;

const SoknaderLink = styled(Link).attrs({ className: 'navds-link' })`
    display: block;
    margin: 2rem 0 1rem;
    width: fit-content;
`;

const LinkWithButtonStyle = styled(Link).attrs({
    className: 'navds-button navds-button--secondary navds-button--medium',
})`
    margin: 0 0.5rem 0 0;
`;

const StyledPanel = styled(Panel)`
    margin-bottom: 3rem;
    min-height: 85vh;
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

interface Props {
    mockAltDefaultFnr: string;
    personliste: Personalia[];
}
export const Oversikt = (props: Props) => {
    const checkmark = '✔';
    const searchParams = useSearchParams();
    const params = getRedirectParams(searchParams);

    return (
        <StyledPanel>
            <Heading level="1" size="xlarge" spacing>
                Testbrukere - oversikt
            </Heading>
            {props.personliste?.length > 0 ? (
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
                            {props.personliste.map((bruker: Personalia) => {
                                return (
                                    <tr key={bruker.fnr}>
                                        <td>{`${bruker.navn.fornavn} ${bruker.navn.mellomnavn} ${bruker.navn.etternavn}`}</td>
                                        <td>{bruker.fnr}</td>
                                        <MerInfo>
                                            <StyledLink
                                                href={'/person?brukerID=' + bruker.fnr + addParams(params, '&')}
                                            >
                                                {bruker.locked ? 'Detaljer' : 'Rediger'}
                                            </StyledLink>
                                            <StyledLink href={'/feil?brukerID=' + bruker.fnr + addParams(params, '&')}>
                                                Feilsituasjoner
                                            </StyledLink>
                                            {props.mockAltDefaultFnr === bruker.fnr && <Bold>{checkmark} Default</Bold>}
                                        </MerInfo>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Tabell>
                </TabellWrapper>
            ) : (
                <BodyLong spacing>Fant ingen eksisterende testbrukere</BodyLong>
            )}
            <LinkWithButtonStyle href={'/person' + addParams(params)}>Opprett bruker</LinkWithButtonStyle>
            <LinkWithButtonStyle href={'/login' + addParams(params)}>Logg inn</LinkWithButtonStyle>
            <SoknaderLink href={'/soknader' + addParams(params)}>Søknader</SoknaderLink>
            <VeiledningLenke href="https://www.nav.no/_/attachment/download/ea62eacf-78a1-4a7a-baed-796f5617c36f:e246ea09b53b232abedb4e2acd96c28572d3c023/Veiledning%20for%20testmilj%C3%B8et%20for%20digital%20s%C3%B8knad%20og%20innsyn.pdf">
                <QuestionmarkDiamondIcon fontSize="1.5rem" /> Veiledning for testmiljøet (pdf)
            </VeiledningLenke>
        </StyledPanel>
    );
};
