import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Bostedsadresse, PersonaliaNavn } from '../PersonMockData';
import { StyledPanel } from '../../../styling/Styles';

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

function getIsoDateString(date: Date) {
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' : '') +
        (date.getMonth() + 1) +
        '-' +
        (date.getDate() < 9 ? '0' : '') +
        (date.getDate() + 1)
    );
}

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

    const [adressenavn, setAdressenavn] = useState<string>('Mulholland Drive');
    const [husnummer, setHusnummer] = useState<number>(42);
    const [postnummer, setPostnummer] = useState<string>('0101');
    const [kommunenummer, setKommunenummer] = useState<string>('0301');

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
                adressenavn: adressenavn,
                husnummer: husnummer,
                kommunenummer: kommunenummer,
                postnummer: postnummer,
            },
            folkeregistepersonstatus: folkeregistepersonstatus,
            foedsel: foedselsdato,
            navn: { fornavn: fornavn, mellomnavn: mellomnavn, etternavn: etternavn },
        };

        callback(nyttBarnObject);
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <Panel>
                <Input value={fnr} label="Ident" onChange={(evt: any) => setFnr(evt.target.value)} />
                <Input label="Fornavn" value={fornavn} onChange={(evt: any) => setFornavn(evt.target.value)} />
                <Input label="Mellomnavn" value={mellomnavn} onChange={(evt: any) => setMellomnavn(evt.target.value)} />
                <Input label="Etternavn" value={etternavn} onChange={(evt: any) => setEtternavn(evt.target.value)} />
                <Input
                    label="Fødselsdato"
                    value={foedselsdato}
                    onChange={(evt: any) => setFoedselsdato(evt.target.value)}
                />
                <Select
                    label="Addressebeskyttelse"
                    onChange={(evt: any) => setAdressebeskyttelse(evt.target.value)}
                    value={adressebeskyttelse}
                >
                    <option value="UGRADERT">Ugradert</option>
                    <option value="STRENGT_FORTROLIG">Strengt fortrolig (kode 6)</option>
                    <option value="STRENGT_FORTROLIG_UTLAND">Strengt fortrolig utland (kode 6)</option>
                    <option value="FORTROLIG">Fortrolig (kode 7)</option>
                </Select>
                <Select
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
                </Select>
                <SkjemaGruppe legend="Bostedsadresse">
                    <Input
                        label="Adressenavn"
                        value={adressenavn}
                        onChange={(evt: any) => setAdressenavn(evt.target.value)}
                    />
                    <Input
                        label="Husnummer"
                        value={husnummer}
                        onChange={(evt: any) => setHusnummer(evt.target.value)}
                    />
                    <Input
                        label="Postnummer"
                        value={postnummer}
                        onChange={(evt: any) => setPostnummer(evt.target.value)}
                    />
                    <Input
                        label="Kommunenummer"
                        value={kommunenummer}
                        onChange={(evt: any) => setKommunenummer(evt.target.value)}
                    />
                </SkjemaGruppe>
                <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                    Legg til
                </Knapp>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                    className="leftPadding"
                >
                    Avbryt
                </Knapp>
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
