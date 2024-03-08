import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Button, Ingress, Panel, TextField } from '@navikt/ds-react';
import { Bostedsadresse, NameWrapper } from '../PersonMockData';
import {
    AvbrytKnapp,
    DefinitionList,
    Knappegruppe,
    StyledFieldset,
    StyledPanel,
    StyledSelect,
} from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import { Adressebeskyttelse, AdressebeskyttelseType } from '../personalia/adressebeskyttelse';
import Adresse from '../adresse/Adresse';
import { useAdresse } from '../adresse/useAdresse';
import { Folkeregisterpersonstatus, FolkeregisterpersonstatusType } from './folkeregisterpersonstatus';
import SletteKnapp from '../../../components/SletteKnapp';
import { PdlPersonNavn } from '../../../generated/model';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface BarnObject {
    fnr: string;
    adressebeskyttelse: AdressebeskyttelseType;
    bostedsadresse: Bostedsadresse;
    folkeregisterpersonstatus: FolkeregisterpersonstatusType;
    foedsel: string;
    navn: PdlPersonNavn;
}

interface Params<T> {
    isOpen: boolean;
    callback: (data?: T) => void;
}

export const NyttBarn = ({ isOpen, callback }: Params<BarnObject>) => {
    let lengesiden = new Date();
    lengesiden.setFullYear(lengesiden.getFullYear() - 10);

    const [fnr, setFnr] = useState<string>('');

    const [fornavn, setFornavn] = useState<string>('Ukjent');
    const [mellomnavn, setMellomnavn] = useState<string>('');
    const [etternavn, setEtternavn] = useState<string>('Mockbarn');

    const [foedselsdato, setFoedselsdato] = useState<string>(getIsoDateString(lengesiden));
    const [adressebeskyttelse, setAdressebeskyttelse] = useState<AdressebeskyttelseType>('UGRADERT');
    const [folkeregisterpersonstatus, setFolkeregisterpersonstatus] = useState<FolkeregisterpersonstatusType>('bosatt');

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

        const nyttBarnObject: BarnObject = {
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
                        {Object.entries(Adressebeskyttelse).map(([key, label]): JSX.Element => {
                            return (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            );
                        })}
                    </StyledSelect>
                    <StyledSelect
                        label="Folkeregisterpersonstatus"
                        onChange={(evt: any) => setFolkeregisterpersonstatus(evt.target.value)}
                        value={folkeregisterpersonstatus}
                    >
                        {Object.entries(Folkeregisterpersonstatus).map(([key, label]): JSX.Element => {
                            return (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            );
                        })}
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

interface Props {
    barn: BarnObject;
    onSlett: () => void;
}

export const VisBarn = ({ barn, onSlett }: Props) => {
    return (
        <StyledPanel>
            <DefinitionList labelWidth={35}>
                <dt>Ident</dt>
                <dd>{barn.fnr}</dd>
                <dt>Navn</dt>
                <dd>
                    {barn.navn.fornavn} {barn.navn.mellomnavn} {barn.navn.etternavn}
                </dd>
                <dt>Fødselsdato</dt>
                <dd>{barn.foedsel}</dd>
                <dt>Adressebeskyttelse</dt>
                <dd>{Adressebeskyttelse[barn.adressebeskyttelse]}</dd>
                <dt>Folkeregisterpersonstatus </dt>
                <dd>{Folkeregisterpersonstatus[barn.folkeregisterpersonstatus]}</dd>
                <dt>Adresse</dt>
                <dd>
                    {barn.bostedsadresse.adressenavn}, {barn.bostedsadresse.husnummer}, {barn.bostedsadresse.husbokstav}
                    , {barn.bostedsadresse.postnummer}, {barn.bostedsadresse.kommunenummer}
                </dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
