import React from 'react';
import { addParams, getRedirectParams } from '../utils/restUtils';
import { BodyLong, Table } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { Bold } from '../styling/Styles';
import { Personalia } from '../generated/model';
import { useGetFastFnr } from '../generated/fiks-controller/fiks-controller';

export const Personliste = ({ personliste }: { personliste: Personalia[] }) => {
    const { data: mockAltDefaultFnr } = useGetFastFnr();
    const params = getRedirectParams();

    if (!personliste.length) return <BodyLong spacing>Fant ingen eksisterende testbrukere</BodyLong>;
    return (
        <Table zebraStripes className={'dark:text-gray-800 dark:bg-gray-400'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Navn</Table.HeaderCell>
                    <Table.HeaderCell>Fnr</Table.HeaderCell>
                    <Table.HeaderCell>Mer info</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {personliste.map(({ fnr, locked, navn }) => (
                    <Table.Row key={fnr}>
                        <Table.DataCell>{`${navn.fornavn} ${navn.mellomnavn} ${navn.etternavn}`}</Table.DataCell>
                        <Table.DataCell>{fnr}</Table.DataCell>
                        <Table.DataCell>
                            <Link className="block" to={`/person?brukerID=${fnr}${addParams(params, '&')}`}>
                                {locked ? 'Detaljer' : 'Rediger'}
                            </Link>
                            <Link className="block" to={`/feil?brukerID=${fnr}${addParams(params, '&')}`}>
                                Feilsituasjoner
                            </Link>
                            {mockAltDefaultFnr === fnr && <Bold>✔ Default</Bold>}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
