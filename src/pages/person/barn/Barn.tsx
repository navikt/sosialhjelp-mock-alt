import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Button, Ingress, Panel, TextField } from '@navikt/ds-react';
import { NameWrapper } from '../PersonMockData';
import { AvbrytKnapp, Knappegruppe, StyledFieldset, StyledSelect } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import { Adressebeskyttelse } from '../personalia/adressebeskyttelse';
import Adresse from '../adresse/Adresse';
import { useAdresse } from '../adresse/useAdresse';
import { Folkeregisterpersonstatus } from './folkeregisterpersonstatus';
import {
    FrontendBarn,
    FrontendBarnAdressebeskyttelse,
    FrontendBarnFolkeregisterpersonstatus,
} from '../../../generated/model';
import { subYears } from 'date-fns';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export const NyttBarn = ({ isOpen, callback }: { isOpen: boolean; callback: (data?: FrontendBarn) => void }) => {
    const lengesiden = subYears(new Date(), 10);

    const [fnr, setFnr] = useState<string>('');

    const [fornavn, setFornavn] = useState<string>('Ukjent');
    const [mellomnavn, setMellomnavn] = useState<string>('');
    const [etternavn, setEtternavn] = useState<string>('Mockbarn');

    const [foedselsdato, setFoedselsdato] = useState<string>(getIsoDateString(lengesiden));
    const [adressebeskyttelse, setAdressebeskyttelse] = useState<FrontendBarnAdressebeskyttelse>('UGRADERT');
    const [folkeregisterpersonstatus, setFolkeregisterpersonstatus] =
        useState<FrontendBarnFolkeregisterpersonstatus>('bosatt');

    const { adresseState, dispatchAdresse } = useAdresse();

    useEffect(() => {
        if (fnr.length < 1) {
            fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
                .then((response) => response.text())
                .then((text) => {
                    setFnr(text);
                });
        }
    }, [fnr.length]);

    const onLagre = (event: ClickEvent) => {
        const husnummerAsNumber = Number(adresseState.husnummer);
        if (!Number.isInteger(husnummerAsNumber)) {
            dispatchAdresse({ type: 'validHusnummer', value: false });
            event.preventDefault();
            return;
        }

        const nyttBarnObject: FrontendBarn = {
            fnr: fnr,
            adressebeskyttelse: adressebeskyttelse,
            bostedsadresse: {
                adressenavn: adresseState.adressenavn,
                husnummer: husnummerAsNumber,
                husbokstav: adresseState.husbokstav,
                kommunenummer: adresseState.kommunenummer,
                postnummer: adresseState.postnummer,
            },
            folkeregisterpersonstatus: folkeregisterpersonstatus,
            foedsel: foedselsdato,
            navn: { fornavn: fornavn, mellomnavn: mellomnavn, etternavn: etternavn },
        };

        callback(nyttBarnObject);
        // Reset state
        setFnr('');
        event.preventDefault();
    };

    const onCancel = (event: ClickEvent) => {
        callback(undefined);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <Panel>
                <StyledFieldset legend="Nytt barn">
                    <TextField
                        value={fnr}
                        label="Ident"
                        onChange={(evt: any) => setFnr(evt.target.value)}
                        htmlSize={20}
                    />
                    <NameWrapper>
                        <TextField
                            label="Fornavn"
                            value={fornavn}
                            onChange={(evt: any) => setFornavn(evt.target.value)}
                        />
                        <TextField
                            label="Mellomnavn"
                            value={mellomnavn}
                            onChange={(evt: any) => setMellomnavn(evt.target.value)}
                        />
                        <TextField
                            label="Etternavn"
                            value={etternavn}
                            onChange={(evt: any) => setEtternavn(evt.target.value)}
                            className="etternavn"
                        />
                    </NameWrapper>
                    <TextField
                        label="Fødselsdato (åååå-mm-dd)"
                        value={foedselsdato}
                        onChange={(evt: any) => setFoedselsdato(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledSelect
                        label="Adressebeskyttelse"
                        onChange={(evt: any) => setAdressebeskyttelse(evt.target.value)}
                        value={adressebeskyttelse}
                    >
                        {Object.entries(Adressebeskyttelse).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </StyledSelect>
                    <StyledSelect
                        label="Folkeregisterpersonstatus"
                        onChange={(evt: any) => setFolkeregisterpersonstatus(evt.target.value)}
                        value={folkeregisterpersonstatus}
                    >
                        {Object.entries(Folkeregisterpersonstatus).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </StyledSelect>
                    <Adresse
                        state={adresseState}
                        dispatch={dispatchAdresse}
                        heading={<Ingress>Bostedsadresse</Ingress>}
                    />
                </StyledFieldset>
                <Knappegruppe>
                    <Button onClick={onLagre}>Legg til</Button>
                    <AvbrytKnapp onClick={onCancel}>Avbryt</AvbrytKnapp>
                </Knappegruppe>
            </Panel>
        </Collapse>
    );
};
