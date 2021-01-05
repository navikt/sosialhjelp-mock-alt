import AlertStripe from 'nav-frontend-alertstriper';
import {Hovedknapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Input, Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel, Undertittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {getMockAltApiURL} from "../../utils/restUtils";
import {useLocation} from "react-router-dom";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface Personalia {
    fnr: string,
    navn: PersonaliaNavn,
    addressebeskyttelse: string,
    sivilstand: string,
    starsborgerskap: string,
    locked: boolean,
}

export interface PersonaliaNavn {
    fornavn: string,
    mellomnavn: string,
    etternavn: string,
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const PersonMockData = () => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [lockedMode, setLockedMode] = useState<boolean>(false)
    const [fnr, setFnr] = useState<string>("");
    const [fornavn, setFornavn] = useState<string>("Ukjent");
    const [mellomnavn, setMellomnavn] = useState<string>("");
    const [etternavn, setEtternavn] = useState<string>("Mockperson");
    const [addressebeskyttelse, setAddressebeskyttelse] = useState<string>("UGRADERT");
    const [sivilstand, setSivilstand] = useState<string>("UOPPGITT");
    const [starsborgerskap, setStatsborgerskap] = useState<string>("NOR");

    const queryFnr = useQuery().get("brukerID");

    useEffect(() => {
        if (queryFnr !== null && queryFnr.length > 1) {
            fetch(`${getMockAltApiURL()}/pdl/download_url?ident=` + queryFnr)
                .then((response) => response.text())
                .then((text) => {
                    const nedlastet: Personalia = JSON.parse(text);
                    setEditMode(true);
                    setLockedMode(nedlastet.locked);
                    setFnr(nedlastet.fnr);
                    setFornavn(nedlastet.navn.fornavn);
                    setMellomnavn(nedlastet.navn.mellomnavn);
                    setEtternavn(nedlastet.navn.etternavn);
                    setAddressebeskyttelse(nedlastet.addressebeskyttelse);
                    setSivilstand(nedlastet.sivilstand);
                    setStatsborgerskap(nedlastet.starsborgerskap);
                });
        }
        if (fnr.length < 1) {
            fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
                .then((response) => response.text())
                .then((text) => {
                    setFnr(text);
                });
        }
    }, [fnr, queryFnr]);

    const onCreateUser = (event: ClickEvent): void => {
        const personalia: Personalia = {
            fnr: fnr,
            navn: {
                fornavn: fornavn,
                mellomnavn: mellomnavn,
                etternavn: etternavn,
            },
            addressebeskyttelse: addressebeskyttelse,
            sivilstand: sivilstand,
            starsborgerskap: starsborgerskap,
            locked: false,
        }
        fetch(`${getMockAltApiURL()}/pdl/upload_url`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalia),
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
        event.preventDefault()
    }

    return (
        <Panel border>
            <Sidetittel>Mock systemdata med mock-alt</Sidetittel>
            <AlertStripe type="advarsel">
                DETTE ER KUN FOR TESTING! Data du legger inn her er tilgjengelig for alle. Ikke legg inn noe sensitiv
                informasjon!
            </AlertStripe>
            <Undertittel>{lockedMode ? "Se på " : editMode ? "Editer " : "Opprett "}bruker</Undertittel>

            <SkjemaGruppe legend="">
                <Input value={fnr}
                       label="BrukerID"
                       disabled={editMode || lockedMode}
                       onChange={(evt: any) => setFnr(evt.target.value)}
                />
            </SkjemaGruppe>
            {lockedMode && <AlertStripe type="info">Du kan ikke editere standardbrukerene.</AlertStripe>}

            <SkjemaGruppe legend="Personalia">
                <Input label="Fornavn"
                       disabled={lockedMode}
                       value={fornavn}
                       onChange={(evt: any) => setFornavn(evt.target.value)}
                />
                <Input label="Mellomnavn"
                       disabled={lockedMode}
                       value={mellomnavn}
                       onChange={(evt: any) => setMellomnavn(evt.target.value)}
                />
                <Input label="Etternavn"
                       disabled={lockedMode}
                       value={etternavn}
                       onChange={(evt: any) => setEtternavn(evt.target.value)}
                />
                <Select label="Addressebeskyttelse"
                        disabled={lockedMode}
                        onChange={(evt: any) => setAddressebeskyttelse(evt.target.value)}
                        value={addressebeskyttelse}
                >
                    <option value="UGRADERT">Ugradert</option>
                    <option value="STRENGT_FORTROLIG">Strengt fortrolig (kode 6)</option>
                    <option value="STRENGT_FORTROLIG_UTLAND">Strengt fortrolig utland (kode 6)</option>
                    <option value="FORTROLIG">Fortrolig (kode 7)</option>
                </Select>
                <Select label="Sivilstand"
                        disabled={lockedMode}
                        onChange={(evt: any) => setSivilstand(evt.target.value)}
                        value={sivilstand}
                >
                    <option value="UOPPGITT">UOPPGITT</option>
                    <option value="UGIFT">UGIFT</option>
                    <option value="GIFT">GIFT</option>
                    <option value="ENKE_ELLER_ENKEMANN">ENKE_ELLER_ENKEMANN</option>
                    <option value="SKILT">SKILT</option>
                    <option value="SEPARERT">SEPARERT</option>
                    <option value="PARTNER">PARTNER</option>
                    <option value="SEPARERT_PARTNER">SEPARERT_PARTNER</option>
                    <option value="SKILT_PARTNER">SKILT_PARTNER</option>
                    <option value="GJENLEVENDE_PARTNER">GJENLEVENDE_PARTNER</option>
                </Select>
                <Select label="Statsborgerskap"
                        disabled={lockedMode}
                        onChange={(evt: any) => setStatsborgerskap(evt.target.value)}
                        value={starsborgerskap}
                >
                    <option value="NOR">Norsk</option>
                    <option value="SWE">Svensk</option>
                    <option value="DEN">Dansk</option>
                    <option value="GER">Tysk</option>
                    <option value="USA">Amerikansk</option>
                    <option value="xxx">Statsløs</option>
                    <option value="???">Mangler opplysninger</option>
                </Select>
            </SkjemaGruppe>

            <Hovedknapp
                disabled={lockedMode}
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateUser(event)}
            >
                Sett systemdata
            </Hovedknapp>
        </Panel>
    );
};
