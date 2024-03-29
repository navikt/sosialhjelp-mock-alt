import React, { useState } from 'react';
import { getFagsystemmockURL, getMockAltApiURL } from '../../utils/restUtils';
import { BodyShort, Button, Heading, Table, Alert } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { useSoknadsListe } from '../../generated/frontend-controller/frontend-controller';

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
const soknadZipUrl = (behandlingsId: string) =>
    `${getMockAltApiURL()}/mock-alt/soknad/${encodeURIComponent(behandlingsId)}`;

const ettersendelseZipUrl = (behandlingsId: string) =>
    `${getMockAltApiURL()}/mock-alt/ettersendelse/${encodeURIComponent(behandlingsId)}`;

const fagsystemUrl = (behandlingsId: string) =>
    `${getFagsystemmockURL()}/?fiksDigisosId=${encodeURIComponent(behandlingsId)}`;

const SoknadTabell = ({ soknadsliste, antallVist }: { soknadsliste: SoknadsInfo[]; antallVist: number }) => {
    if (!soknadsliste?.length) return <BodyShort>Fant ingen søknader</BodyShort>;

    return (
        <Table zebraStripes>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope={'col'}>Søknad-ID</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Navn</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Ident</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Tittel</Table.HeaderCell>
                    <Table.HeaderCell scope={'col'}>Mer info</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {soknadsliste
                    .slice(0, antallVist)
                    .map(({ fiksDigisosId, sokerFnr, sokerNavn, tittel, vedlegg, vedleggSomMangler }: SoknadsInfo) => (
                        <Table.Row key={fiksDigisosId}>
                            <Table.DataCell>
                                <Link to={fiksDigisosId}>{fiksDigisosId}</Link>
                            </Table.DataCell>
                            <Table.DataCell className={'whitespace-nowrap hidden'}>{sokerNavn}</Table.DataCell>
                            <Table.DataCell>{sokerFnr}</Table.DataCell>
                            <Table.DataCell>{tittel}</Table.DataCell>
                            <Table.DataCell className={'whitespace-pre'}>
                                <BodyShort>Antall vedlegg: {vedlegg.length}</BodyShort>
                                {!!vedleggSomMangler && (
                                    <Alert variant={'warning'} inline>
                                        {vedleggSomMangler} vedlegg mangler
                                    </Alert>
                                )}
                                <Link to={soknadZipUrl(fiksDigisosId)}>Last ned soknad-zip</Link>
                                <br />
                                <Link to={ettersendelseZipUrl(fiksDigisosId)}>Last ned ettersendelse-zip</Link>
                                <br />
                                <Link to={fagsystemUrl(fiksDigisosId)}>Åpne i "fagsystem"</Link>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
            </Table.Body>
        </Table>
    );
};

export const Soknader = () => {
    const [antallVist, setAntallVist] = useState(DEFAULT_ANTALL_VIST);

    const onSeMerClicked = () => {
        setAntallVist(antallVist + DEFAULT_ANTALL_VIST);
    };

    const { data: soknadsliste } = useSoknadsListe();

    if (!soknadsliste) return null;
    return (
        <div>
            <Heading level="2" size="large" spacing>
                Søknader
            </Heading>
            <SoknadTabell soknadsliste={soknadsliste} antallVist={antallVist} />
            {soknadsliste?.length > DEFAULT_ANTALL_VIST && (
                <Button size="small" onClick={onSeMerClicked}>
                    Se flere
                </Button>
            )}
        </div>
    );
};
