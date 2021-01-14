import AlertStripe from 'nav-frontend-alertstriper';
import {Hovedknapp, Knapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Input, Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel, Undertittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {addParams, getMockAltApiURL, getRedirectParams, isLoginSession} from "../../utils/restUtils";
import {useLocation} from "react-router-dom";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface Personalia {
    fnr: string,
    navn: PersonaliaNavn,
    addressebeskyttelse: string,
    sivilstand: string,
    ektefelle: string,
    starsborgerskap: string,
    bostedsadresse: Bostedsadresse
    locked: boolean,
}

export interface PersonaliaNavn {
    fornavn: string,
    mellomnavn: string,
    etternavn: string,
}

export interface Bostedsadresse {
    adressenavn: string,
    husnummer: number,
    postnummer: string,
    kommunenummer: string
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
    const [ektefelle, setEktefelle] = useState<string>("INGEN");
    const [starsborgerskap, setStatsborgerskap] = useState<string>("NOR");
    const [adressenavn, setAdressenavn] = useState<string>("Mulholland Drive")
    const [husnummer, setHusnummer] = useState<number>(42)
    const [postnummer, setPostnummer] = useState<string>("0101")
    const [kommunenummer, setKommunenummer] = useState<string>("0301")

    const queryFnr = useQuery().get("brukerID");
    const params = getRedirectParams();
    const history = useHistory()

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
                    setAdressenavn(nedlastet.bostedsadresse.adressenavn);
                    setHusnummer(nedlastet.bostedsadresse.husnummer);
                    setPostnummer(nedlastet.bostedsadresse.postnummer);
                    setKommunenummer(nedlastet.bostedsadresse.kommunenummer);
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
            ektefelle: ektefelle,
            starsborgerskap: starsborgerskap,
            bostedsadresse: {
                adressenavn: adressenavn,
                husnummer: husnummer,
                postnummer: postnummer,
                kommunenummer: kommunenummer
            },
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
        if(isLoginSession(params)) {
            window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}${addParams(params, "&")}`;
        } else {
            history.push("/" + addParams(params))
        }
        event.preventDefault()
    }

    const onGoBack = (event: ClickEvent): void => {
        history.push("/" + addParams(params))
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
                <Select label="Ektefelle"
                        disabled={lockedMode}
                        onChange={(evt: any) => setEktefelle(evt.target.value)}
                        value={ektefelle}
                >
                    <option value="INGEN">-</option>
                    <option value="EKTEFELLE_SAMME_BOSTED">EKTEFELLE_SAMME_BOSTED</option>
                    <option value="EKTEFELLE_ANNET_BOSTED">EKTEFELLE_ANNET_BOSTED</option>
                    <option value="EKTEFELLE_MED_ADRESSEBESKYTTELSE">EKTEFELLE_MED_ADRESSEBESKYTTELSE</option>
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
                    <option value="XXX">Statsløs</option>
                    <option value="XUK">Ukjent/Mangler opplysninger</option>
                </Select>
            </SkjemaGruppe>
            <SkjemaGruppe legend="Bostedsadresse">
                <Input label="Adressenavn"
                       disabled={lockedMode}
                       value={adressenavn}
                       onChange={(evt: any) => setAdressenavn(evt.target.value)}
                />
                <Input label="Husnummer"
                       disabled={lockedMode}
                       value={husnummer}
                       onChange={(evt: any) => setHusnummer(evt.target.value)}
                />
                <Input label="Postnummer"
                       disabled={lockedMode}
                       value={postnummer}
                       onChange={(evt: any) => setPostnummer(evt.target.value)}
                />
                <Input label="Kommunenummer"
                       disabled={lockedMode}
                       value={kommunenummer}
                       onChange={(evt: any) => setKommunenummer(evt.target.value)}
                />
            </SkjemaGruppe>

            {!lockedMode &&
                <Hovedknapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateUser(event)}
                >
                    {editMode ? "Lagre endringer" : "Opprett bruker"} {isLoginSession(params) && " og logg inn"}
                </Hovedknapp>
            }
            <Knapp
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onGoBack(event)}
            >
                {lockedMode ? "Tilbake" : "Cancel" }
            </Knapp>
        </Panel>
    );
};
