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
import {
    NyttUtbetalingerFraNav,
    UtbetalingFraNavObject,
    VisUtbetalingerFraNav,
} from './utbetalinger/UtbetalingerFraNav';
import { Adressebeskyttelse } from './personalia/adressebeskyttelse';
import { Sivilstand } from './familie/familie';
import { FlexWrapper, StyledSelect } from '../../styling/Styles';
import Adresse from './adresse/Adresse';
import { useAdresse } from './adresse/useAdresse';
import { useAppStatus } from './useAppStatus';
import { Alert, BodyShort, Button, Checkbox, Label, Panel, Title, TextField, Fieldset, Select } from '@navikt/ds-react';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface Personalia {
    fnr: string;
    navn: PersonaliaNavn;
    adressebeskyttelse: string;
    sivilstand: string;
    ektefelle: string;
    barn: BarnObject[];
    starsborgerskap: string;
    bostedsadresse: Bostedsadresse;
    telefonnummer: string;
    kontonummer: string;
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
    husbokstav: string;
    postnummer: string;
    kommunenummer: string;
}

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const StyledPanel = styled(Panel)`
    .navds-alert {
        margin-bottom: 1rem;
    }

    .brukerIdent {
        margin-bottom: 2rem;
    }
`;

const Knappegruppe = styled(FlexWrapper)`
    margin-bottom: 2rem;
    align-items: center;
`;

export const NameWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;

    .navds-form-field {
        flex: 1;
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

    .navds-fieldset {
        margin-bottom: 2.5rem;
    }

    .leggTilBostotte {
        margin-bottom: 1.5rem;
    }
`;

export const PersonMockData = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [lockedMode, setLockedMode] = useState<boolean>(false);
    const { appStatus, dispatchAppStatus } = useAppStatus();
    const [fnr, setFnr] = useState<string>('');
    const [fornavn, setFornavn] = useState<string>('Ukjent');
    const [mellomnavn, setMellomnavn] = useState<string>('');
    const [etternavn, setEtternavn] = useState<string>('Mockperson');
    const [adressebeskyttelse, setAdressebeskyttelse] = useState<string>('UGRADERT');
    const [sivilstand, setSivilstand] = useState<string>('UOPPGITT');
    const [ektefelle, setEktefelle] = useState<string>('INGEN');
    const [starsborgerskap, setStatsborgerskap] = useState<string>('NOR');

    const [brukTelefonnummer, setBrukTelefonnummer] = useState<boolean>(false);
    const [telefonnummer, setTelefonnummer] = useState<string>('99999999');

    const [brukKontonummer, setBrukKontonummer] = useState<boolean>(false);
    const [kontonummer, setKontonummer] = useState<string>('11112233333');

    const [visNyttBarnSkjema, setVisNyttBarnSkjema] = useState<boolean>(false);
    const [barn, setBarn] = useState<BarnObject[]>([]);

    const [leggTilArbeidsforhold, setLeggTilArbeidsforhold] = useState<boolean>(false);
    const [arbeidsforhold, setArbeidsforhold] = useState<ArbeidsforholdObject[]>([]);

    const [leggTilSkatt, setLeggTilSkatt] = useState<boolean>(false);
    const [skattutbetalinger, setSkattutbetalinger] = useState<SkatteutbetalingObject[]>([]);

    const [leggTilBostotteSak, setLeggTilBostotteSak] = useState<boolean>(false);
    const [bostotteSaker, setBostotteSaker] = useState<BostotteSakObject[]>([]);

    const [leggTilBostotteUtbetaling, setLeggTilBostotteUtbetaling] = useState<boolean>(false);
    const [bostotteUtbetalinger, setBostotteUtbetalinger] = useState<BostotteUtbetalingObject[]>([]);

    const [leggTilUtbetalingFraNav, setLeggTilUtbetalingFraNav] = useState<boolean>(false);
    const [utbetalingerFraNav, setUtbetalingerFraNav] = useState<UtbetalingFraNavObject[]>([]);

    const { adresseState, dispatchAdresse } = useAdresse();

    const queryFnr = useQuery().get('brukerID');
    const params = getRedirectParams();
    const history = useHistory();

    useEffect(() => {
        let promises = [];
        if (queryFnr !== null && queryFnr?.length > 1) {
            const promise = fetch(`${getMockAltApiURL()}/mock-alt/personalia?ident=` + queryFnr)
                .then((response) => {
                    if (response.status === 204)
                        throw new Error(
                            `Person med personnummer ${queryFnr}  ikke funnet. Feilkode:  ${response.status}`
                        );
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
                    setAdressebeskyttelse(nedlastet.adressebeskyttelse);
                    setEktefelle(nedlastet.ektefelle);
                    setSivilstand(nedlastet.sivilstand);
                    setBarn(nedlastet.barn);
                    setStatsborgerskap(nedlastet.starsborgerskap);
                    dispatchAdresse({ type: 'adressenavn', value: nedlastet.bostedsadresse.adressenavn });
                    dispatchAdresse({ type: 'husnummer', value: nedlastet.bostedsadresse.husnummer.toString() });
                    dispatchAdresse({ type: 'husbokstav', value: nedlastet.bostedsadresse.husbokstav });
                    dispatchAdresse({ type: 'postnummer', value: nedlastet.bostedsadresse.postnummer });
                    dispatchAdresse({ type: 'kommunenummer', value: nedlastet.bostedsadresse.kommunenummer });
                    setBrukTelefonnummer(nedlastet.telefonnummer !== '');
                    setTelefonnummer(nedlastet.telefonnummer);
                    setBrukKontonummer(nedlastet.kontonummer !== '');
                    setKontonummer(nedlastet.kontonummer);
                    setArbeidsforhold(nedlastet.arbeidsforhold);
                    setSkattutbetalinger(nedlastet.skattetatenUtbetalinger);
                    setBostotteSaker(nedlastet.bostotteSaker);
                    setBostotteUtbetalinger(nedlastet.bostotteUtbetalinger);
                    setUtbetalingerFraNav(nedlastet.utbetalingerFraNav);
                });

            promises.push(promise);
        } else {
            const promiseFnr = fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
                .then((response) => response.text())
                .then((text) => {
                    setFnr(text);
                });
            promises.push(promiseFnr);
        }

        Promise.all(promises)
            .then(() => dispatchAppStatus({ type: 'success' }))
            .catch((e) => {
                dispatchAppStatus({ type: 'fetchError', msg: e.message });
            });
    }, [queryFnr, dispatchAdresse, dispatchAppStatus]);

    const leggTilBarnCallback = (nyttTilBarn?: BarnObject) => {
        if (nyttTilBarn) {
            setBarn([...barn, nyttTilBarn]);
        }
        setVisNyttBarnSkjema(false);
    };

    function fjernObject<T>(state: T[], setState: (newState: T[]) => void, toBeRemoved: T) {
        setState(state.filter((item) => item !== toBeRemoved));
    }

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
            setBostotteSaker([...bostotteSaker, nyBostotteSak]);
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

    const leggTilUtbetalingFraNavCallback = (nyUtbetaling: UtbetalingFraNavObject) => {
        if (nyUtbetaling) {
            utbetalingerFraNav.push(nyUtbetaling);
            setUtbetalingerFraNav(utbetalingerFraNav);
        }
        setLeggTilUtbetalingFraNav(false);
    };

    const createPersonaliaObject = (): Personalia | null => {
        const tlf = brukTelefonnummer ? telefonnummer : '';
        const kontonr = brukKontonummer ? kontonummer : '';

        const husnummerAsNumber = Number(adresseState.husnummer);
        if (!Number.isInteger(husnummerAsNumber)) {
            dispatchAdresse({ type: 'validHusnummer', value: false });
            return null;
        }

        return {
            fnr: fnr,
            navn: {
                fornavn: fornavn,
                mellomnavn: mellomnavn,
                etternavn: etternavn,
            },
            adressebeskyttelse: adressebeskyttelse,
            sivilstand: sivilstand,
            ektefelle: ektefelle,
            barn: barn,
            starsborgerskap: starsborgerskap,
            bostedsadresse: {
                adressenavn: adresseState.adressenavn,
                husnummer: husnummerAsNumber,
                husbokstav: adresseState.husbokstav,
                postnummer: adresseState.postnummer,
                kommunenummer: adresseState.kommunenummer,
            },
            telefonnummer: tlf,
            kontonummer: kontonr,
            arbeidsforhold: arbeidsforhold,
            bostotteSaker: bostotteSaker,
            bostotteUtbetalinger: bostotteUtbetalinger,
            skattetatenUtbetalinger: skattutbetalinger,
            utbetalingerFraNav: utbetalingerFraNav,
            locked: false,
        };
    };
    const onCreateUser = (event: ClickEvent): void => {
        const personalia = createPersonaliaObject();
        if (!personalia) {
            event.preventDefault();
            return;
        }
        fetch(`${getMockAltApiURL()}/mock-alt/personalia`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalia),
        })
            .then((response) => {
                if (response.ok) {
                    dispatchAppStatus({ type: 'success' });

                    if (isLoginSession(params)) {
                        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}&issuerId=selvbetjening&audience=someaudience${addParams(
                            params,
                            '&'
                        )}`;
                    } else {
                        history.push('/' + addParams(params));
                    }
                } else if (response.status === 500) {
                    throw new Error(
                        `Noe gikk galt ved opprettelse av person, se over om feltene har riktig format og prøv igjen.`
                    );
                } else {
                    throw new Error(`Opprettelse av person feilet. Feilkode:  ${response.status}`);
                }
            })
            .catch((error) => {
                dispatchAppStatus({ type: 'postError', msg: error.toString() });
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

    if (appStatus.status === 'loading') {
        return <BodyShort>Laster...</BodyShort>;
    } else if (appStatus.status === 'fetchError') {
        return (
            <>
                <Title level={1} size="2xl" spacing>
                    Noe gikk galt..
                </Title>
                <BodyShort spacing>{appStatus.errorMessage}</BodyShort>
            </>
        );
    }

    return (
        <StyledPanel>
            <Alert variant="warning">
                DETTE ER KUN FOR TESTING! Data du legger inn her er tilgjengelig for alle. Ikke legg inn noe sensitiv
                informasjon!
            </Alert>
            {lockedMode && <Alert variant="info">Du kan ikke redigere standardbrukerene.</Alert>}
            <Title level={1} size="2xl" spacing>
                {overskrift()}
            </Title>
            <TextField
                value={fnr}
                label="Ident / fødselsnummer"
                disabled={editMode || lockedMode}
                onChange={(evt: any) => setFnr(evt.target.value)}
                className="brukerIdent"
            />
            <GruppeStyle>
                <Fieldset
                    legend={
                        <Title level={2} size="l" spacing>
                            Personopplysninger
                        </Title>
                    }
                >
                    <NameWrapper>
                        <TextField
                            label="Fornavn"
                            disabled={lockedMode}
                            value={fornavn}
                            onChange={(evt: any) => setFornavn(evt.target.value)}
                        />
                        <TextField
                            label="Mellomnavn"
                            disabled={lockedMode}
                            value={mellomnavn}
                            onChange={(evt: any) => setMellomnavn(evt.target.value)}
                        />
                        <TextField
                            label="Etternavn"
                            disabled={lockedMode}
                            value={etternavn}
                            onChange={(evt: any) => setEtternavn(evt.target.value)}
                        />
                    </NameWrapper>
                    <StyledSelect
                        label="Adressebeskyttelse"
                        disabled={lockedMode}
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
                </Fieldset>
                <Fieldset legend="Telefonnummer">
                    {!lockedMode && (
                        <Checkbox
                            disabled={lockedMode}
                            onChange={(evt: any) => setBrukTelefonnummer(evt.target.checked)}
                            defaultChecked={brukTelefonnummer}
                        >
                            Sett telefonnummer
                        </Checkbox>
                    )}
                    <Collapse isOpened={brukTelefonnummer}>
                        <TextField
                            label="Telefonnummer"
                            disabled={lockedMode || !brukTelefonnummer}
                            value={telefonnummer}
                            onChange={(evt: any) => setTelefonnummer(evt.target.value)}
                        />
                    </Collapse>
                </Fieldset>
                <Fieldset legend="Kontonummer">
                    {!lockedMode && (
                        <Checkbox
                            disabled={lockedMode}
                            onChange={(evt: any) => setBrukKontonummer(evt.target.checked)}
                            defaultChecked={brukKontonummer}
                        >
                            Sett kontonummer
                        </Checkbox>
                    )}
                    <Collapse isOpened={brukKontonummer}>
                        <TextField
                            label="Kontonummer"
                            disabled={lockedMode || !brukKontonummer}
                            value={kontonummer}
                            onChange={(evt: any) => setKontonummer(evt.target.value)}
                        />
                    </Collapse>
                </Fieldset>
            </GruppeStyle>
            <GruppeStyle>
                <Adresse lockedMode={lockedMode} state={adresseState} dispatch={dispatchAdresse} />
            </GruppeStyle>
            <GruppeStyle>
                <Fieldset
                    legend={
                        <Title level={2} size="l" spacing>
                            Arbeidsforhold
                        </Title>
                    }
                >
                    {arbeidsforhold.map((forhold: ArbeidsforholdObject, index: number) => {
                        return (
                            <VisArbeidsforhold
                                arbeidsforhold={forhold}
                                key={'arbeid_' + index}
                                onSlett={() => fjernObject(arbeidsforhold, setArbeidsforhold, forhold)}
                            />
                        );
                    })}
                    <NyttArbeidsforhold isOpen={leggTilArbeidsforhold} callback={leggTilArbeidsforholdCallback} />
                    {!lockedMode && !leggTilArbeidsforhold && (
                        <Button onClick={() => setLeggTilArbeidsforhold(true)}>Legg til arbeidsforhold</Button>
                    )}
                </Fieldset>
            </GruppeStyle>
            <GruppeStyle>
                <Fieldset
                    legend={
                        <Title level={2} size="l" spacing>
                            Familiesituasjon
                        </Title>
                    }
                >
                    <StyledSelect
                        label="Sivilstand"
                        disabled={lockedMode}
                        onChange={(evt: any) => setSivilstand(evt.target.value)}
                        value={sivilstand}
                    >
                        {Object.entries(Sivilstand).map(
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
                        <Label>Barn</Label>
                        {barn.map((obj: BarnObject, index: number) => {
                            return (
                                <VisBarn
                                    barn={obj}
                                    key={'barn_' + index}
                                    onSlett={() => fjernObject(barn, setBarn, obj)}
                                />
                            );
                        })}
                        <NyttBarn isOpen={visNyttBarnSkjema} callback={leggTilBarnCallback} />
                        {!lockedMode && !visNyttBarnSkjema && (
                            <Button onClick={() => setVisNyttBarnSkjema(true)}>Legg til barn</Button>
                        )}
                    </BarnWrapper>
                </Fieldset>
            </GruppeStyle>
            <InntektGruppeStyle>
                <Title level={2} size="l" spacing>
                    Inntekt og formue
                </Title>
                <Fieldset legend="Skattetaten">
                    {skattutbetalinger.map((utbetaling: SkatteutbetalingObject, index: number) => {
                        return (
                            <VisSkatteutbetaling
                                skatteutbetaling={utbetaling}
                                key={'skatt_' + index}
                                onSlett={() => fjernObject(skattutbetalinger, setSkattutbetalinger, utbetaling)}
                            />
                        );
                    })}
                    <NyttSkatteutbetaling isOpen={leggTilSkatt} callback={leggTilSkattCallback} />
                    {!lockedMode && !leggTilSkatt && (
                        <Button onClick={() => setLeggTilSkatt(true)}>Legg til utbetaling</Button>
                    )}
                </Fieldset>
                <Fieldset legend="Husbanken">
                    {bostotteSaker.map((sak: BostotteSakObject, index: number) => {
                        return (
                            <VisBostotteSak
                                bostotteSak={sak}
                                key={'bostotteSak_' + index}
                                onSlett={() => fjernObject(bostotteSaker, setBostotteSaker, sak)}
                            />
                        );
                    })}
                    <NyBostotteSak isOpen={leggTilBostotteSak} callback={leggTilBostotteSakCallback} />
                    {!lockedMode && !leggTilBostotteSak && (
                        <Button className="leggTilBostotte" onClick={() => setLeggTilBostotteSak(true)}>
                            Legg til sak
                        </Button>
                    )}
                    {bostotteUtbetalinger.map((utbetaling: BostotteUtbetalingObject, index: number) => {
                        return (
                            <VisBostotteUtbetaling
                                bostotteUtbetaling={utbetaling}
                                key={'bostotteUtbetaling_' + index}
                                onSlett={() => fjernObject(bostotteUtbetalinger, setBostotteUtbetalinger, utbetaling)}
                            />
                        );
                    })}
                    <NyttBostotteUtbetaling
                        isOpen={leggTilBostotteUtbetaling}
                        callback={leggTilBostotteUtbetalingCallback}
                    />
                    {!lockedMode && !leggTilBostotteUtbetaling && (
                        <Button onClick={() => setLeggTilBostotteUtbetaling(true)}>Legg til utbetaling</Button>
                    )}
                </Fieldset>
                <Fieldset legend="Nav utbetalinger">
                    {utbetalingerFraNav.map((utbetaling: UtbetalingFraNavObject, index: number) => {
                        return (
                            <VisUtbetalingerFraNav
                                utbetalingFraNav={utbetaling}
                                key={'utbetalingFraNav_' + index}
                                onSlett={() => fjernObject(utbetalingerFraNav, setUtbetalingerFraNav, utbetaling)}
                            />
                        );
                    })}
                    <NyttUtbetalingerFraNav
                        isOpen={leggTilUtbetalingFraNav}
                        callback={leggTilUtbetalingFraNavCallback}
                    />
                    {!lockedMode && !leggTilUtbetalingFraNav && (
                        <Button onClick={() => setLeggTilUtbetalingFraNav(true)}>Legg til utbetaling</Button>
                    )}
                </Fieldset>
            </InntektGruppeStyle>
            {
                /*midlertidig løsning, bør ha validering på felter som kan feile*/
                appStatus.status === 'postError' && <Alert variant="error">{appStatus.errorMessage}</Alert>
            }
            <Knappegruppe>
                {!lockedMode && (
                    <Button
                        variant="action"
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateUser(event)}
                    >
                        {editMode ? 'Lagre endringer' : 'Opprett bruker'} {isLoginSession(params) && ' og logg inn'}
                    </Button>
                )}
                <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onGoBack(event)}>
                    {lockedMode ? 'Tilbake' : 'Avbryt'}
                </Button>
            </Knappegruppe>
        </StyledPanel>
    );
};
