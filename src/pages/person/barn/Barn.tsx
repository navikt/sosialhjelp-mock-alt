import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input } from 'nav-frontend-skjema';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Bostedsadresse, NameWrapper, PersonaliaNavn } from '../PersonMockData';
import { Knappegruppe, StyledPanel, StyledSelect } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import styled from 'styled-components/macro';
import { Adressebeskyttelse } from '../../personalia/adressebeskyttelse';
import Adresse from '../adresse/Adresse';
import { useAdresse } from '../adresse/useAdresse';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface BarnObject {
    fnr: string;
    adressebeskyttelse: string;
    bostedsadresse: Bostedsadresse;
    folkeregistepersonstatus: string;
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
    const [adressebeskyttelse, setAdressebeskyttelse] = useState<string>('UGRADERT');
    const [folkeregistepersonstatus, setFolkeregistepersonstatus] = useState<string>('bosatt');

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
            folkeregistepersonstatus: folkeregistepersonstatus,
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
                        ([key, value]: any): JSX.Element => {
                            return (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            );
                        }
                    )}
                </StyledSelect>
                <StyledSelect
                    label="Folkeregisterpersonstatus"
                    onChange={(evt: any) => setFolkeregistepersonstatus(evt.target.value)}
                    value={folkeregistepersonstatus}
                >
                    <option value="bosatt">Bosatt</option>
                    <option value="utflyttet">Utflyttet</option>
                    <option value="forsvunnet">Forsvunnet</option>
                    <option value="doed">Død</option>
                    <option value="opphoert">Opphørt</option>
                    <option value="foedselsregistrert">Fødselsregistrert</option>
                    <option value="midlertidig">Midlertidig</option>
                    <option value="inaktiv">Inaktiv</option>
                    <option value="ikkeBosatt">Ikke bosatt</option>
                    <option value="aktiv">Aktiv</option>
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

interface ViseParams {
    barn: BarnObject;
}

export const VisBarn = ({ barn }: ViseParams) => {
    return (
        <StyledPanel>
            <div>Ident: {barn.fnr}</div>
            <div>
                Navn: {barn.navn.fornavn} {barn.navn.mellomnavn} {barn.navn.etternavn}
            </div>
            <div>Fødselsdato: {barn.foedsel}</div>
            <div>Adressebeskyttelse: {barn.adressebeskyttelse}</div>
            <div>Folkeregisterpersonstatus: {barn.folkeregistepersonstatus}</div>
            <div>
                Addresse: {barn.bostedsadresse.adressenavn}, {barn.bostedsadresse.husnummer},{' '}
                {barn.bostedsadresse.postnummer}, {barn.bostedsadresse.kommunenummer}
            </div>
        </StyledPanel>
    );
};
