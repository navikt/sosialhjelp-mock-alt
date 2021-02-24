import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Checkbox, Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { Sidetittel, Undertittel, Element } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { addParams, getMockAltApiURL, getRedirectParams, isLoginSession } from '../../utils/restUtils';
import { ArbeidsforholdObject, NyttArbeidsforhold, VisArbeidsforhold } from './arbeidsforhold/Arbeidsfohold';
import { BostotteSakObject, NyBostotteSak, VisBostotteSak } from './husbanken/BostotteSak';
import {
    BostotteUtbetalingObject,
    NyttBostotteUtbetaling,
    VisBostotteUtbetaling,
} from './husbanken/BostotteUtbetaling';
import { NyttSkatteutbetaling, SkatteutbetalingObject, VisSkatteutbetaling } from './skattetaten/Skattetaten';
import { Collapse } from 'react-collapse';
import { BarnObject, NyttBarn, VisBarn } from './barn/Barn';
import styled from 'styled-components/macro';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { UtbetalingFraNavObject } from './utbetalinger/UtbetalingerFraNav';
import { Adressebeskyttelse } from '../personalia/adressebeskyttelse';
import { Sivilstand } from './familie/familie';
import { StyledSelect, theme } from '../../styling/Styles';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface Personalia {
    fnr: string;
    navn: PersonaliaNavn;
    addressebeskyttelse: string;
    sivilstand: string;
    ektefelle: string;
    barn: BarnObject[];
    starsborgerskap: string;
    bostedsadresse: Bostedsadresse;
    telefonnummer: string;
    organisasjon: string;
    organisasjonsNavn: string;
    arbeidsforhold: ArbeidsforholdObject[];
    bostotteSaker: BostotteSakObject[];
    bostotteUtbetalinger: BostotteUtbetalingObject[];
    skattetatenUtbetalinger: SkatteutbetalingObject[];
    utbetalingerFraNav: UtbetalingFraNavObject[];
    locked: boolean;
}

export interface PersonaliaNavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
}

export interface Bostedsadresse {
    adressenavn: string;
    husnummer: number;
    postnummer: string;
    kommunenummer: string;
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const StyledPanel = styled(Panel)`
    h1 {
        margin-bottom: 1rem;
    }

    .alertstripe {
        margin-bottom: 1rem;
    }

    .brukerIdent {
        margin-bottom: 2rem;
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Knappegruppe = styled(FlexWrapper)`
    button {
        margin-right: 1rem;

        @media ${theme.mobileMaxWidth} {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
`;

const NameWrapper = styled(FlexWrapper)`
    .etternavn {
        flex-grow: 1;
    }

    .skjemaelement {
        margin-right: 0.5rem;
    }
`;

const AdresseWrapper = styled(FlexWrapper)`
    input {
        width: 5rem;
    }

    .adresse {
        flex: 1 1 30rem;
        input {
            width: 100%;
        }
    }

    .skjemaelement {
        margin-right: 0.5rem;
    }
`;

const BarnWrapper = styled.div`
    margin-bottom: 1rem;

    h3 {
        margin-bottom: 0.5rem;
    }
`;

const GruppeStyle = styled.div`
    padding: 1rem;
    background-color: #f3f3f3;
    margin-bottom: 2rem;
`;

const InntektGruppeStyle = styled(GruppeStyle)`
    h2 {
        margin-bottom: 1rem;
    }

    .skjemagruppe {
        margin-bottom: 1rem;
    }

    .leggTilBostotte {
        margin-bottom: 0.5rem;
    }
`;

const AdresseGruppe = styled(SkjemaGruppe)`
    .kommunenr {
        max-width: 5rem;
    }
`;

export const PersonMockData = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [lockedMode, setLockedMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
    const [fnr, setFnr] = useState<string>('');
    const [fornavn, setFornavn] = useState<string>('Ukjent');
    const [mellomnavn, setMellomnavn] = useState<string>('');
    const [etternavn, setEtternavn] = useState<string>('Mockperson');
    const [addressebeskyttelse, setAddressebeskyttelse] = useState<string>('UGRADERT');
    const [sivilstand, setSivilstand] = useState<string>('UOPPGITT');
    const [ektefelle, setEktefelle] = useState<string>('INGEN');
    const [starsborgerskap, setStatsborgerskap] = useState<string>('NOR');

    const [brukTelefonnummer, setBrukTelefonnummer] = useState<boolean>(false);
    const [telefonnummer, setTelefonnummer] = useState<string>('99999999');
    const [brukOrganisasjon, setBrukOrganisasjon] = useState<boolean>(false);
    const [organisasjon, setOrganisasjon] = useState<string>('');
    const [organisasjonsNavn, setOrganisasjonsNavn] = useState<string>('Organisasjonsnavn');

    const [leggTilBarn, setLeggTilBarn] = useState<boolean>(false);
    const [barn, setBarn] = useState<BarnObject[]>([]);

    const [leggTilArbeidsforhold, setLeggTilArbeidsforhold] = useState<boolean>(false);
    const [arbeidsforhold, setArbeidsforhold] = useState<ArbeidsforholdObject[]>([]);

    const [leggTilSkatt, setLeggTilSkatt] = useState<boolean>(false);
    const [skattutbetalinger, setSkattutbetalinger] = useState<SkatteutbetalingObject[]>([]);

    const [leggTilBostotteSak, setLeggTilBostotteSak] = useState<boolean>(false);
    const [bostotteSaker, setBostotteSaker] = useState<BostotteSakObject[]>([]);

    const [leggTilBostotteUtbetaling, setLeggTilBostotteUtbetaling] = useState<boolean>(false);
    const [bostotteUtbetalinger, setBostotteUtbetalinger] = useState<BostotteUtbetalingObject[]>([]);

    const [adressenavn, setAdressenavn] = useState<string>('Mulholland Drive');
    const [husnummer, setHusnummer] = useState<number>(42);
    const [postnummer, setPostnummer] = useState<string>('0101');
    const [kommunenummer, setKommunenummer] = useState<string>('0301');

    const queryFnr = useQuery().get('brukerID');
    const params = getRedirectParams();
    const history = useHistory();

    useEffect(() => {
        let promises = [];
        if (queryFnr !== null && queryFnr?.length > 1) {
            const promise = fetch(`${getMockAltApiURL()}/mock-alt/personalia?ident=` + queryFnr)
                .then((response) => {
                    if (response.status === 204)
                        throw new Error('Person med personnummer: ' + queryFnr + ' ikke funnet: ' + response.status);
                    if (response.status > 199 && response.status < 300) {
                        return response.json();
                    }
                    throw new Error('HttpStatus ' + response.status);
                })
                .then((jsonObject) => {
                    const nedlastet: Personalia = jsonObject;
                    setEditMode(true);
                    setLockedMode(nedlastet.locked);
                    setFnr(nedlastet.fnr);
                    setFornavn(nedlastet.navn.fornavn);
                    setMellomnavn(nedlastet.navn.mellomnavn);
                    setEtternavn(nedlastet.navn.etternavn);
                    setAddressebeskyttelse(nedlastet.addressebeskyttelse);
                    setSivilstand(nedlastet.sivilstand);
                    setBarn(nedlastet.barn);
                    setStatsborgerskap(nedlastet.starsborgerskap);
                    setAdressenavn(nedlastet.bostedsadresse.adressenavn);
                    setHusnummer(nedlastet.bostedsadresse.husnummer);
                    setPostnummer(nedlastet.bostedsadresse.postnummer);
                    setKommunenummer(nedlastet.bostedsadresse.kommunenummer);
                    setBrukTelefonnummer(nedlastet.telefonnummer !== '');
                    setTelefonnummer(nedlastet.telefonnummer);
                    setBrukOrganisasjon(nedlastet.organisasjon !== '' || nedlastet.organisasjonsNavn !== '');
                    setOrganisasjon(nedlastet.organisasjon);
                    setOrganisasjonsNavn(nedlastet.organisasjonsNavn);
                    setArbeidsforhold(nedlastet.arbeidsforhold);
                    setSkattutbetalinger(nedlastet.skattetatenUtbetalinger);
                    setBostotteSaker(nedlastet.bostotteSaker);
                    setBostotteUtbetalinger(nedlastet.bostotteUtbetalinger);
                });

            promises.push(promise);
        } else {
            const promiseFnr = fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
                .then((response) => response.text())
                .then((text) => {
                    setFnr(text);
                });
            promises.push(promiseFnr);

            const promiseOrg = fetch(`${getMockAltApiURL()}/fiks/tilfeldig/orgnummer`)
                .then((response) => response.text())
                .then((text) => {
                    setOrganisasjon(text);
                });
            promises.push(promiseOrg);
        }

        Promise.all(promises)
            .then(() => setLoading('SUCCESS'))
            .catch(() => setLoading('ERROR'));
    }, [queryFnr]);

    const leggTilBarnCallback = (nyttTilBarn: BarnObject) => {
        if (nyttTilBarn) {
            barn.push(nyttTilBarn);
            setBarn(barn);
        }
        setLeggTilBarn(false);
    };

    const leggTilArbeidsforholdCallback = (nyttTilArbeidsforhold: ArbeidsforholdObject) => {
        if (nyttTilArbeidsforhold) {
            arbeidsforhold.push(nyttTilArbeidsforhold);
            setArbeidsforhold(arbeidsforhold);
        }
        setLeggTilArbeidsforhold(false);
    };

    const leggTilSkattCallback = (nyUtbetaling: SkatteutbetalingObject) => {
        if (nyUtbetaling) {
            skattutbetalinger.push(nyUtbetaling);
            setSkattutbetalinger(skattutbetalinger);
        }
        setLeggTilSkatt(false);
    };

    const leggTilBostotteSakCallback = (nyBostotteSak: BostotteSakObject) => {
        if (nyBostotteSak) {
            bostotteSaker.push(nyBostotteSak);
            setBostotteSaker(bostotteSaker);
        }
        setLeggTilBostotteSak(false);
    };

    const leggTilBostotteUtbetalingCallback = (nyBostotteUtbetaling: BostotteUtbetalingObject) => {
        if (nyBostotteUtbetaling) {
            bostotteUtbetalinger.push(nyBostotteUtbetaling);
            setBostotteUtbetalinger(bostotteUtbetalinger);
        }
        setLeggTilBostotteUtbetaling(false);
    };

    const createPersonaliaObject = (): Personalia => {
        const tlf = brukTelefonnummer ? telefonnummer : '';
        const org = brukOrganisasjon ? organisasjon : '';
        const orgnavn = brukOrganisasjon ? organisasjonsNavn : '';
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
            barn: barn,
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
            utbetalingerFraNav: [],
            locked: false,
        };
    };
    const onCreateUser = (event: ClickEvent): void => {
        const personalia: Personalia = createPersonaliaObject();
        fetch(`${getMockAltApiURL()}/mock-alt/personalia`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalia),
        })
            .then((response) => {
                console.log(response);
                if (isLoginSession(params)) {
                    window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}${addParams(params, '&')}`;
                } else {
                    history.push('/' + addParams(params));
                }
            })
            .catch((error) => {
                console.log(error);
            });
        event.preventDefault();
    };

    const onGoBack = (event: ClickEvent): void => {
        history.push('/' + addParams(params));
        event.preventDefault();
    };

    const overskrift = () => {
        if (lockedMode) {
            return 'Systemdata for testbruker';
        } else if (editMode) {
            return 'Rediger systemdata for testbruker';
        } else {
            return 'Sett systemdata for testbruker';
        }
    };

    if (loading === 'LOADING') {
        return <NavFrontendSpinner />;
    } else if (loading === 'ERROR') {
        return <Sidetittel>Klarte ikke fetche data :( </Sidetittel>;
    }

    return (
        <StyledPanel>
            <AlertStripe type="advarsel">
                DETTE ER KUN FOR TESTING! Data du legger inn her er tilgjengelig for alle. Ikke legg inn noe sensitiv
                informasjon!
            </AlertStripe>
            <Sidetittel>{overskrift()}</Sidetittel>
            <Input
                value={fnr}
                label="Ident / fødselsnummer"
                disabled={editMode || lockedMode}
                onChange={(evt: any) => setFnr(evt.target.value)}
                className="brukerIdent"
                bredde="M"
            />
            {lockedMode && <AlertStripe type="info">Du kan ikke redigere standardbrukerene.</AlertStripe>}
            <GruppeStyle>
                <SkjemaGruppe legend={<Undertittel>Personopplysninger</Undertittel>}>
                    <NameWrapper>
                        <Input
                            label="Fornavn"
                            disabled={lockedMode}
                            value={fornavn}
                            onChange={(evt: any) => setFornavn(evt.target.value)}
                        />
                        <Input
                            label="Mellomnavn"
                            disabled={lockedMode}
                            value={mellomnavn}
                            onChange={(evt: any) => setMellomnavn(evt.target.value)}
                        />
                        <Input
                            inputClassName="etternavn-input"
                            className="etternavn"
                            label="Etternavn"
                            disabled={lockedMode}
                            value={etternavn}
                            onChange={(evt: any) => setEtternavn(evt.target.value)}
                        />
                    </NameWrapper>
                    <StyledSelect
                        label="Addressebeskyttelse"
                        disabled={lockedMode}
                        onChange={(evt: any) => setAddressebeskyttelse(evt.target.value)}
                        value={addressebeskyttelse}
                    >
                        {Object.entries(Adressebeskyttelse).map(
                            ([key, value]: any): JSX.Element => {
                                return <option value={key}>{value}</option>;
                            }
                        )}
                    </StyledSelect>
                    <Select
                        label="Statsborgerskap"
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
                        <Checkbox
                            label="Sett telefonnummer"
                            disabled={lockedMode}
                            onChange={(evt: any) => setBrukTelefonnummer(evt.target.checked)}
                            value={brukTelefonnummer ? 'true' : 'false'}
                        />
                        <Collapse isOpened={brukTelefonnummer}>
                            <Input
                                label="Telefonnummer"
                                disabled={lockedMode || !brukTelefonnummer}
                                value={telefonnummer}
                                onChange={(evt: any) => setTelefonnummer(evt.target.value)}
                            />
                        </Collapse>
                    </SkjemaGruppe>
                </SkjemaGruppe>
            </GruppeStyle>
            <GruppeStyle>
                <AdresseGruppe legend={<Undertittel>Bostedsadresse</Undertittel>}>
                    <AdresseWrapper>
                        <Input
                            label="Gateadresse"
                            className="adresse"
                            disabled={lockedMode}
                            value={adressenavn}
                            onChange={(evt: any) => setAdressenavn(evt.target.value)}
                        />
                        <Input
                            label="Husnummer"
                            disabled={lockedMode}
                            value={husnummer}
                            onChange={(evt: any) => setHusnummer(evt.target.value)}
                        />
                        <Input
                            label="Postnummer"
                            disabled={lockedMode}
                            value={postnummer}
                            onChange={(evt: any) => setPostnummer(evt.target.value)}
                        />
                    </AdresseWrapper>
                    <Input
                        label="Kommunenummer"
                        disabled={lockedMode}
                        value={kommunenummer}
                        onChange={(evt: any) => setKommunenummer(evt.target.value)}
                        className="kommunenr"
                    />
                </AdresseGruppe>
            </GruppeStyle>
            <GruppeStyle>
                <SkjemaGruppe legend={<Undertittel>Arbeidsforhold</Undertittel>}>
                    <NyttArbeidsforhold
                        isOpen={leggTilArbeidsforhold}
                        callback={leggTilArbeidsforholdCallback}
                        organisasjonsnummer={organisasjon}
                    />
                    {arbeidsforhold.map((forhold: ArbeidsforholdObject, index: number) => {
                        return <VisArbeidsforhold arbeidsforhold={forhold} key={'arbeid_' + index} />;
                    })}
                    {!leggTilArbeidsforhold && (
                        <Knapp onClick={() => setLeggTilArbeidsforhold(true)}>Legg til arbeidsforhold</Knapp>
                    )}
                </SkjemaGruppe>
            </GruppeStyle>
            <GruppeStyle>
                <SkjemaGruppe legend={<Undertittel>Familiesituasjon</Undertittel>}>
                    <StyledSelect
                        label="Sivilstand"
                        disabled={lockedMode}
                        onChange={(evt: any) => setSivilstand(evt.target.value)}
                        value={sivilstand}
                    >
                        {Object.entries(Sivilstand).map(
                            ([key, value]: any): JSX.Element => {
                                return <option value={key}>{value}</option>;
                            }
                        )}
                    </StyledSelect>
                    <StyledSelect
                        label="Ektefelle"
                        disabled={lockedMode}
                        onChange={(evt: any) => setEktefelle(evt.target.value)}
                        value={ektefelle}
                    >
                        <option value="INGEN">Ingen</option>
                        <option value="EKTEFELLE_SAMME_BOSTED">Samme bosted</option>
                        <option value="EKTEFELLE_ANNET_BOSTED">Annet bosted</option>
                        <option value="EKTEFELLE_MED_ADRESSEBESKYTTELSE">Med adressebeskyttelse</option>
                    </StyledSelect>
                    <BarnWrapper>
                        <Element tag="h3">Barn</Element>
                        <NyttBarn isOpen={leggTilBarn} callback={leggTilBarnCallback} />
                        {barn.map((barn: BarnObject, index: number) => {
                            return <VisBarn barn={barn} key={'barn_' + index} />;
                        })}
                        {!leggTilBarn && <Knapp onClick={() => setLeggTilBarn(true)}>Legg til barn</Knapp>}
                    </BarnWrapper>
                </SkjemaGruppe>
            </GruppeStyle>
            <InntektGruppeStyle>
                <Undertittel>Inntekt og formue</Undertittel>
                <SkjemaGruppe legend="Skattetaten">
                    <NyttSkatteutbetaling isOpen={leggTilSkatt} callback={leggTilSkattCallback} />
                    {skattutbetalinger.map((utbetaling: SkatteutbetalingObject, index: number) => {
                        return <VisSkatteutbetaling skatteutbetaling={utbetaling} key={'skatt_' + index} />;
                    })}
                    {!leggTilSkatt && <Knapp onClick={() => setLeggTilSkatt(true)}>Legg til utbetaling</Knapp>}
                </SkjemaGruppe>
                <SkjemaGruppe legend="Husbanken">
                    <NyBostotteSak isOpen={leggTilBostotteSak} callback={leggTilBostotteSakCallback} />
                    {bostotteSaker.map((sak: BostotteSakObject, index: number) => {
                        return <VisBostotteSak bostotteSak={sak} key={'bostotteSak_' + index} />;
                    })}
                    {!leggTilBostotteSak && (
                        <Knapp className="leggTilBostotte" onClick={() => setLeggTilBostotteSak(true)}>
                            Legg til sak
                        </Knapp>
                    )}
                    <NyttBostotteUtbetaling
                        isOpen={leggTilBostotteUtbetaling}
                        callback={leggTilBostotteUtbetalingCallback}
                    />
                    {bostotteUtbetalinger.map((utbetaling: BostotteUtbetalingObject, index: number) => {
                        return (
                            <VisBostotteUtbetaling
                                bostotteUtbetaling={utbetaling}
                                key={'bostotteUtbetaling_' + index}
                            />
                        );
                    })}
                    {!leggTilBostotteUtbetaling && (
                        <Knapp onClick={() => setLeggTilBostotteUtbetaling(true)}>Legg til utbetaling</Knapp>
                    )}
                </SkjemaGruppe>
                <SkjemaGruppe legend="Nav utbetalinger">
                    <Panel border={true}>Ikke støttet ennå. Bruker standardverdier for utbetalinger.</Panel>
                </SkjemaGruppe>
            </InntektGruppeStyle>
            <Knappegruppe>
                {!lockedMode && (
                    <Hovedknapp
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateUser(event)}
                    >
                        {editMode ? 'Lagre endringer' : 'Opprett bruker'} {isLoginSession(params) && ' og logg inn'}
                    </Hovedknapp>
                )}
                <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onGoBack(event)}>
                    {lockedMode ? 'Tilbake' : 'Avbryt'}
                </Knapp>
            </Knappegruppe>
        </StyledPanel>
    );
};
