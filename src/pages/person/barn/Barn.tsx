import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input } from 'nav-frontend-skjema';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Bostedsadresse, NameWrapper, PersonaliaNavn } from '../PersonMockData';
import { DefinitionList, Knappegruppe, StyledPanel, StyledSelect } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import styled from 'styled-components/macro';
import { Adressebeskyttelse, AdressebeskyttelseType } from '../../personalia/adressebeskyttelse';
import Adresse from '../adresse/Adresse';
import { useAdresse } from '../adresse/useAdresse';
import { Folkeregisterpersonstatus, FolkeregisterpersonstatusType } from './folkeregisterpersonstatus';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface BarnObject {
    fnr: string;
    adressebeskyttelse: AdressebeskyttelseType;
    bostedsadresse: Bostedsadresse;
    folkeregisterpersonstatus: FolkeregisterpersonstatusType;
    foedsel: string;
    navn: PersonaliaNavn;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

const StyledInput = styled(Input)<{ size?: number }>`
    input {
        max-width: ${(props) => (props.size ? `${props.size}rem` : '10rem')};
    }
`;

export const NyttBarn = ({ isOpen, callback }: Params) => {
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
        const nyttBarnObject: BarnObject = {
            fnr: fnr,
            adressebeskyttelse: adressebeskyttelse,
            bostedsadresse: {
                adressenavn: adresseState.adressenavn,
                husnummer: adresseState.husnummer,
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
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <Panel className="blokk-s">
                <StyledInput value={fnr} label="Ident" onChange={(evt: any) => setFnr(evt.target.value)} />
                <NameWrapper>
                    <Input label="Fornavn" value={fornavn} onChange={(evt: any) => setFornavn(evt.target.value)} />
                    <Input
                        label="Mellomnavn"
                        value={mellomnavn}
                        onChange={(evt: any) => setMellomnavn(evt.target.value)}
                    />
                    <Input
                        label="Etternavn"
                        value={etternavn}
                        onChange={(evt: any) => setEtternavn(evt.target.value)}
                        className="etternavn"
                    />
                </NameWrapper>
                <StyledInput
                    label="Fødselsdato (åååå-mm-dd)"
                    value={foedselsdato}
                    onChange={(evt: any) => setFoedselsdato(evt.target.value)}
                />
                <StyledSelect
                    label="Adressebeskyttelse"
                    onChange={(evt: any) => setAdressebeskyttelse(evt.target.value)}
                    value={adressebeskyttelse}
                >
                    {Object.entries(Adressebeskyttelse).map(
                        ([key, label]): JSX.Element => {
                            return (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            );
                        }
                    )}
                </StyledSelect>
                <StyledSelect
                    label="Folkeregisterpersonstatus"
                    onChange={(evt: any) => setFolkeregisterpersonstatus(evt.target.value)}
                    value={folkeregisterpersonstatus}
                >
                    {Object.entries(Folkeregisterpersonstatus).map(
                        ([key, label]): JSX.Element => {
                            return (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            );
                        }
                    )}
                </StyledSelect>
                <Adresse state={adresseState} dispatch={dispatchAdresse} />
                <Knappegruppe>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Knapp>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}>
                        Avbryt
                    </Knapp>
                </Knappegruppe>
            </Panel>
        </Collapse>
    );
};

interface Props {
    barn: BarnObject;
}

export const VisBarn = ({ barn }: Props) => {
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
                    {barn.bostedsadresse.adressenavn}, {barn.bostedsadresse.husnummer}, {barn.bostedsadresse.postnummer}
                    , {barn.bostedsadresse.kommunenummer}
                </dd>
            </DefinitionList>
        </StyledPanel>
    );
};
