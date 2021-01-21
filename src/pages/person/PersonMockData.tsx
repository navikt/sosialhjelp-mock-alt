import AlertStripe from 'nav-frontend-alertstriper';
import {Hovedknapp, Knapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Checkbox, Input, Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel, Undertittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {addParams, getMockAltApiURL, getRedirectParams, isLoginSession} from "../../utils/restUtils";
import {useLocation} from "react-router-dom";
import {ArbeidsforholdObject, NyttArbeidsforhold, VisArbeidsforhold} from "./arbeidsforhold/Arbeidsfohold";
import {BostotteSakObject, NyBostotteSak, VisBostotteSak} from "./husbanken/BostotteSak";
import {BostotteUtbetalingObject, NyttBostotteUtbetaling, VisBostotteUtbetaling} from "./husbanken/BostotteUtbetaling";
import {NyttSkatteutbetaling, SkatteutbetalingObject, VisSkatteutbetaling} from "./skattetaten/Skattetaten";
import {Collapse} from "react-collapse";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface Personalia {
    fnr: string,
    navn: PersonaliaNavn,
    addressebeskyttelse: string,
    sivilstand: string,
    ektefelle: string,
    starsborgerskap: string,
    bostedsadresse: Bostedsadresse,
    telefonnummer: string,
    organisasjon: string,
    organisasjonsNavn: string,
    arbeidsforhold: ArbeidsforholdObject[],
    bostotteSaker: BostotteSakObject[],
    bostotteUtbetalinger: BostotteUtbetalingObject[],
    skattetatenUtbetalinger: SkatteutbetalingObject[],
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

    const [brukTelefonnummer, setBrukTelefonnummer] = useState<boolean>(false)
    const [telefonnummer, setTelefonnummer] = useState<string>("99999999")
    const [brukOrganisasjon, setBrukOrganisasjon] = useState<boolean>(false)
    const [organisasjon, setOrganisasjon] = useState<string>("1234567890")
    const [organisasjonsNavn, setOrganisasjonsNavn] = useState<string>("Organisasjonsnavn")

    const [leggTilArbeidsforhold, setLeggTilArbeidsforhold] = useState<boolean>(false)
    const [arbeidsforhold, setArbeidsforhold] = useState<ArbeidsforholdObject[]>([])

    const [leggTilSkatt, setLeggTilSkatt] = useState<boolean>(false)
    const [skattutbetalinger, setSkattutbetalinger] = useState<SkatteutbetalingObject[]>([])

    const [leggTilBostotteSak, setLeggTilBostotteSak] = useState<boolean>(false)
    const [bostotteSaker, setBostotteSaker] = useState<BostotteSakObject[]>([])

    const [leggTilBostotteUtbetaling, setLeggTilBostotteUtbetaling] = useState<boolean>(false)
    const [bostotteUtbetalinger, setBostotteUtbetalinger] = useState<BostotteUtbetalingObject[]>([])

    const [adressenavn, setAdressenavn] = useState<string>("Mulholland Drive")
    const [husnummer, setHusnummer] = useState<number>(42)
    const [postnummer, setPostnummer] = useState<string>("0101")
    const [kommunenummer, setKommunenummer] = useState<string>("0301")

    const queryFnr = useQuery().get("brukerID");
    const params = getRedirectParams();
    const history = useHistory()

    useEffect(() => {
        if (queryFnr !== null && queryFnr.length > 1) {
            fetch(`${getMockAltApiURL()}/mock-alt/personalia?ident=` + queryFnr)
                .then((response) => {
                    if (response.status === 204) throw new Error("Person med personnummer: " + queryFnr + " ikke funnet: " + response.status);
                    if (response.status > 199 && response.status < 300) {
                        return response.json();
                    }
                    throw new Error("HttpStatus " + response.status);
                })
                .then((jsonObject) => {
                    const nedlastet: Personalia = jsonObject;
                    console.dir(nedlastet);
                    console.dir(nedlastet.telefonnummer !== "");
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
                    setBrukTelefonnummer(nedlastet.telefonnummer !== "");
                    setTelefonnummer(nedlastet.telefonnummer);
                    setBrukOrganisasjon(nedlastet.organisasjon !== "" || nedlastet.organisasjonsNavn !== "");
                    setOrganisasjon(nedlastet.organisasjon);
                    setOrganisasjonsNavn(nedlastet.organisasjonsNavn);
                    setArbeidsforhold(nedlastet.arbeidsforhold);
                    setSkattutbetalinger(nedlastet.skattetatenUtbetalinger);
                    setBostotteSaker(nedlastet.bostotteSaker);
                    setBostotteUtbetalinger(nedlastet.bostotteUtbetalinger);
                    console.dir(brukTelefonnummer)
                    console.dir(setBrukOrganisasjon)
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

    const leggTilArbeidsforholdCallback = (nyttTilArbeidsforhold: ArbeidsforholdObject) => {
        if (nyttTilArbeidsforhold) {
            arbeidsforhold.push(nyttTilArbeidsforhold);
            setArbeidsforhold(arbeidsforhold);
        }
        setLeggTilArbeidsforhold(false)
    };

    const leggTilSkattCallback = (nyUtbetaling: SkatteutbetalingObject) => {
        if (nyUtbetaling) {
            skattutbetalinger.push(nyUtbetaling);
            setSkattutbetalinger(skattutbetalinger);
        }
        setLeggTilSkatt(false)
    };

    const leggTilBostotteSakCallback = (nyBostotteSak: BostotteSakObject) => {
        if (nyBostotteSak) {
            bostotteSaker.push(nyBostotteSak);
            setBostotteSaker(bostotteSaker);
        }
        setLeggTilBostotteSak(false)
    };

    const leggTilBostotteUtbetalingCallback = (nyBostotteUtbetaling: BostotteUtbetalingObject) => {
        if (nyBostotteUtbetaling) {
            bostotteUtbetalinger.push(nyBostotteUtbetaling);
            setBostotteUtbetalinger(bostotteUtbetalinger);
        }
        setLeggTilBostotteUtbetaling(false)
    };

    const createPersonaliaObject = (): Personalia => {
        const tlf = brukTelefonnummer ? telefonnummer : "";
        const org = brukOrganisasjon ? organisasjon : "";
        const orgnavn = brukOrganisasjon ? organisasjonsNavn : "";
        return {
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
                kommunenummer: kommunenummer,
            },
            telefonnummer: tlf,
            organisasjon: org,
            organisasjonsNavn: orgnavn,
            arbeidsforhold: arbeidsforhold,
            bostotteSaker: bostotteSaker,
            bostotteUtbetalinger: bostotteUtbetalinger,
            skattetatenUtbetalinger: skattutbetalinger,
            locked: false,
        }
    }
    const onCreateUser = (event: ClickEvent): void => {
        const personalia: Personalia = createPersonaliaObject()
        fetch(`${getMockAltApiURL()}/mock-alt/personalia`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalia),
        }).then(response => {
            console.log(response)
            if (isLoginSession(params)) {
                window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}${addParams(params, "&")}`;
            } else {
                history.push("/" + addParams(params))
            }
        }).catch(error => {
            console.log(error)
        })
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
                <SkjemaGruppe legend="Telefonnummer">
                    <Checkbox label="Sett telefonnummer"
                              disabled={lockedMode}
                              onChange={(evt: any) => setBrukTelefonnummer(evt.target.checked)}
                              value={brukTelefonnummer ? "true" : "false"}
                    />
                    <Collapse isOpened={brukTelefonnummer}>
                        <Input label="Telefonnummer"
                               disabled={lockedMode || (!brukTelefonnummer)}
                               value={telefonnummer}
                               onChange={(evt: any) => setTelefonnummer(evt.target.value)}
                        />
                    </Collapse>
                </SkjemaGruppe>
                <SkjemaGruppe legend="Organisasjon">
                    <Checkbox label="Sett organisasjon"
                              disabled={lockedMode}
                              onChange={(evt: any) => setBrukOrganisasjon(evt.target.checked)}
                              value={brukOrganisasjon ? "true" : "false"}
                    />
                    <Collapse isOpened={brukOrganisasjon}>
                    <Input label="Organisasjonsnavn"
                           disabled={lockedMode || (!brukOrganisasjon)}
                           value={organisasjonsNavn}
                           onChange={(evt: any) => setOrganisasjonsNavn(evt.target.value)}
                    />
                    <Input label="Organisasjonsnummer"
                           disabled={lockedMode || (!brukOrganisasjon)}
                           value={organisasjon}
                           onChange={(evt: any) => setOrganisasjon(evt.target.value)}
                    />
                    </Collapse>
                </SkjemaGruppe>
            </SkjemaGruppe>
            <SkjemaGruppe legend="Arbeidsforhold">
                <NyttArbeidsforhold isOpen={leggTilArbeidsforhold} callback={leggTilArbeidsforholdCallback}/>
                {arbeidsforhold.map((forhold: ArbeidsforholdObject, index: number) => {
                    return <VisArbeidsforhold arbeidsforhold={forhold} key={"arbeid_" + index}/>
                })}
                {!leggTilArbeidsforhold &&
                <Knapp onClick={() => (setLeggTilArbeidsforhold(true))}>Legg til arbeidsforhold</Knapp>
                }
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
            <SkjemaGruppe legend="Skattetaten">
                <NyttSkatteutbetaling isOpen={leggTilSkatt} callback={leggTilSkattCallback}/>
                {skattutbetalinger.map((utbetaling: SkatteutbetalingObject, index: number) => {
                    return <VisSkatteutbetaling skatteutbetaling={utbetaling} key={"skatt_" + index}/>
                })}
                {!leggTilSkatt &&
                <Knapp onClick={() => (setLeggTilSkatt(true))}>Legg til utbetaling</Knapp>
                }
            </SkjemaGruppe>
            <SkjemaGruppe legend="Husbanken">
                <NyBostotteSak isOpen={leggTilBostotteSak} callback={leggTilBostotteSakCallback}/>
                {bostotteSaker.map((sak: BostotteSakObject, index: number) => {
                    return <VisBostotteSak bostotteSak={sak} key={"bostotteSak_" + index}/>
                })}
                {!leggTilBostotteSak &&
                <Knapp onClick={() => (setLeggTilBostotteSak(true))}>Legg til sak</Knapp>
                }
                <NyttBostotteUtbetaling isOpen={leggTilBostotteUtbetaling}
                                        callback={leggTilBostotteUtbetalingCallback}/>
                {bostotteUtbetalinger.map((utbetaling: BostotteUtbetalingObject, index: number) => {
                    return <VisBostotteUtbetaling bostotteUtbetaling={utbetaling} key={"bostotteUtbetaling_" + index}/>
                })}
                {!leggTilBostotteUtbetaling &&
                <Knapp onClick={() => (setLeggTilBostotteUtbetaling(true))}>Legg til utbetaling</Knapp>
                }
            </SkjemaGruppe>
            <SkjemaGruppe legend="Nav utbetalinger">
                <Panel border={true}>
                    Ikke støttet ennå. Bruker standardverdier for utbetalinger.
                </Panel>
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
                {lockedMode ? "Tilbake" : "Cancel"}
            </Knapp>
        </Panel>
    );
};
