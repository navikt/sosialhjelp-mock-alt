import React from 'react';
import styled from 'styled-components';
import { Heading, Link as NavDsLink } from '@navikt/ds-react';
import { QuestionmarkDiamondIcon } from '@navikt/aksel-icons';
import { Personliste } from './Personliste';
import { usePersonListe } from '../generated/frontend-controller/frontend-controller';

const VeiledningLenke = styled(NavDsLink)`
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    width: fit-content;
`;

export const Oversikt = () => {
    const { data: personliste } = usePersonListe();

    if (!personliste) return <div>Laster...</div>;

    return (
        <div>
            <Heading level="2" size="large" spacing>
                Testbrukere - oversikt
            </Heading>
            <Personliste personliste={personliste} />
            <VeiledningLenke href="https://www.nav.no/_/attachment/download/ea62eacf-78a1-4a7a-baed-796f5617c36f:e246ea09b53b232abedb4e2acd96c28572d3c023/Veiledning%20for%20testmilj%C3%B8et%20for%20digital%20s%C3%B8knad%20og%20innsyn.pdf">
                <QuestionmarkDiamondIcon fontSize="1.5rem" /> Veiledning for testmiljøet (pdf)
            </VeiledningLenke>
        </div>
    );
};
