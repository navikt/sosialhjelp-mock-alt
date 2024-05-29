import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addParams, getRedirectParams, getRedirectUrl, isLoginSession } from '../../utils/restUtils';
import { ArbeidsforholdObject } from './arbeidsforhold/Arbeidsfohold';
import { Collapse } from 'react-collapse';
import styled from 'styled-components';
import { Adressebeskyttelse } from './personalia/adressebeskyttelse';
import { Sivilstand } from './familie/familie';
import { StyledSelect } from '../../styling/Styles';
import Adresse from './adresse/Adresse';
import { useAdresse } from './adresse/useAdresse';
import { useAppStatus } from './useAppStatus';
import { Alert, BodyShort, Button, Checkbox, Fieldset, Heading, TextField } from '@navikt/ds-react';
import { AdministratorRollerPanel, VisAdministratorRoller } from './roller/AdministratorRoller';
import {
    FrontendBarn,
    FrontendPersonalia,
    FrontendPersonaliaAdministratorRollerItem,
    FrontendPersonaliaAdressebeskyttelse,
    SakerDto,
} from '../../generated/model';
import { getMockPerson, putMockPerson } from '../../generated/frontend-controller/frontend-controller';
import { getTilfeldigFnr } from '../../generated/fiks-controller/fiks-controller';
import { BarnSkjema } from './barn/BarnSkjema';
import { NavnSkjema } from './barn/NavnSkjema';
import { ArbeidsforholdSkjema } from './ArbeidsforholdSkjema';
import { initialPersonalia } from './InitialPersonalia';
import { UtbetalingerSkjema } from './UtbetalingerSkjema';
import { SkatteutbetalingerSkjema } from './SkatteutbetalingerSkjema';
import { BostotteSakSkjema } from './BostotteSakSkjema';
import { BostotteUtbetalingSkjema } from './BostotteUtbetalingSkjema';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const GruppeStyle = styled.div`
    padding: 1rem;
    background-color: #f3f3f3;
    margin-bottom: 2rem;
    label {
        margin-top: 1rem;
    }
    @media (prefers-color-scheme: dark) {
        background-color: #2d2d2d;
    }
`;

export const PersonMockData = () => {
    const [personalia, setPersonalia] = useState<FrontendPersonalia>({ ...initialPersonalia });

    const [editMode, setEditMode] = useState<boolean>(false);
    const [lockedMode, setLockedMode] = useState<boolean>(false);
    const { appStatus, dispatchAppStatus } = useAppStatus();

    const [brukKontonummer, setBrukKontonummer] = useState<boolean>(false);
    const [editAdministratorRoller, setEditAdministratorRoller] = useState<boolean>(false);
    const [administratorRoller, setAdministratorRoller] = useState<FrontendPersonaliaAdministratorRollerItem[]>([]);

    const { adresseState, bostedsadresse, dispatchAdresse } = useAdresse();
    const queryFnr = new URLSearchParams(useLocation().search).get('brukerID');
    const params = getRedirectParams();
    const navigate = useNavigate();

    useEffect(() => {
        let promises = [];
        if (!queryFnr?.length) {
            promises.push(getTilfeldigFnr().then((fnr) => setPersonalia({ ...initialPersonalia, fnr })));
        } else {
            const promise = getMockPerson({ ident: queryFnr }).then((nedlastet) => {
                setPersonalia(nedlastet);
                setEditMode(true);
                setLockedMode(nedlastet.locked);
                dispatchAdresse({ type: 'initialize', value: nedlastet.bostedsadresse });
                setBrukKontonummer(nedlastet.kontonummer !== '');
                setAdministratorRoller(nedlastet.administratorRoller);
            });

            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => dispatchAppStatus({ type: 'success' }))
            .catch((e) => {
                dispatchAppStatus({ type: 'fetchError', msg: e.message });
            });
    }, [queryFnr, dispatchAdresse, dispatchAppStatus]);

    if (!personalia) return null;

    const createPersonaliaObject = (): FrontendPersonalia | null => {
        const kontonr = brukKontonummer ? personalia.kontonummer : '';

        if (!Number.isInteger(Number(adresseState.husnummer))) {
            dispatchAdresse({ type: 'validHusnummer', value: false });
            return null;
        }

        return {
            ...personalia,
            bostedsadresse,
            kontonummer: kontonr,
            administratorRoller: administratorRoller,
            locked: false,
        };
    };
    const onCreateUser = async (event: ClickEvent): Promise<void> => {
        const personalia = createPersonaliaObject();
        if (!personalia) {
            event.preventDefault();
            return;
        }

        try {
            await putMockPerson(personalia);

            dispatchAppStatus({ type: 'success' });

            if (isLoginSession(params)) {
                window.location.href = getRedirectUrl(personalia.fnr).href;
            } else {
                navigate('/' + addParams(params));
            }
        } catch (error: any) {
            dispatchAppStatus({ type: 'postError', msg: error.toString() });
        }

        event.preventDefault();
    };

    if (appStatus.status === 'loading') {
        return <BodyShort>Laster...</BodyShort>;
    } else if (appStatus.status === 'fetchError') {
        return (
            <>
                <Heading level="1" size="xlarge" spacing>
                    Noe gikk galt..
                </Heading>
                <BodyShort spacing>{appStatus.errorMessage}</BodyShort>
            </>
        );
    }

    return (
        <>
            <Heading level="1" size="xlarge" spacing>
                {lockedMode
                    ? 'Systemdata for testbruker'
                    : editMode
                      ? 'Rediger systemdata for testbruker'
                      : 'Sett systemdata for testbruker'}
            </Heading>
            <div className={'pb-4'}>
                <Alert variant="warning">
                    <Heading spacing size="xsmall" level="2">
                        DETTE ER KUN FOR TESTING!
                    </Heading>
                    Data du legger inn her er tilgjengelig for alle. Ikke legg inn noe sensitiv informasjon!
                </Alert>
                {lockedMode && <Alert variant="info">Du kan ikke redigere standardbrukerene.</Alert>}
            </div>
            <GruppeStyle>
                <Heading level="2" size="medium" spacing>
                    Personopplysninger
                </Heading>
                <TextField
                    value={personalia.fnr}
                    label="Ident / fødselsnummer"
                    disabled={editMode || lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, fnr: evt.target.value })}
                />
                <NavnSkjema navn={personalia.navn} onChange={(navn) => setPersonalia({ ...personalia, navn })} />
                <StyledSelect
                    label="Adressebeskyttelse"
                    disabled={lockedMode}
                    onChange={(evt) =>
                        setPersonalia({
                            ...personalia,
                            adressebeskyttelse: evt.target.value as FrontendPersonaliaAdressebeskyttelse,
                        })
                    }
                    value={personalia.adressebeskyttelse}
                >
                    {Object.entries(Adressebeskyttelse).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </StyledSelect>
                <StyledSelect
                    label="Skjerming"
                    disabled={lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, skjerming: evt.target.value === 'true' })}
                    value={personalia.skjerming ? 'true' : 'false'}
                >
                    <option key={'ikkeSkjermet'} value={'false'}>
                        Ikke skjermet
                    </option>
                    <option key={'skjermet'} value={'true'}>
                        Skjermet
                    </option>
                </StyledSelect>
                <StyledSelect
                    label="Statsborgerskap"
                    disabled={lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, starsborgerskap: evt.target.value })}
                    value={personalia.starsborgerskap}
                >
                    <option value="NOR">Norsk</option>
                    <option value="SWE">Svensk</option>
                    <option value="DNK">Dansk</option>
                    <option value="DEU">Tysk</option>
                    <option value="USA">Amerikansk</option>
                    <option value="XXX">Statsløs</option>
                    <option value="XUK">Ukjent/Mangler opplysninger</option>
                </StyledSelect>
                <Heading size={'small'} level={'3'} className={'pt-4'}>
                    Kontaktinformasjon
                </Heading>
                <TextField
                    label="Telefonnummer"
                    htmlSize={15}
                    disabled={lockedMode}
                    value={personalia.telefonnummer}
                    onChange={(evt) => setPersonalia({ ...personalia, telefonnummer: evt.target.value })}
                />
                <TextField
                    label="Epostadresse"
                    htmlSize={35}
                    disabled={lockedMode}
                    value={personalia.epost}
                    onChange={(evt) => setPersonalia({ ...personalia, epost: evt.target.value })}
                />
                <Checkbox
                    disabled={lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, kanVarsles: evt.target.checked })}
                    defaultChecked={personalia.kanVarsles}
                >
                    Kan varsles
                </Checkbox>
                <Fieldset legend={'Kontonummer'}>
                    {!lockedMode && (
                        <Checkbox
                            disabled={lockedMode}
                            onChange={(evt) => setBrukKontonummer(evt.target.checked)}
                            defaultChecked={brukKontonummer}
                        >
                            Sett kontonummer
                        </Checkbox>
                    )}
                    <Collapse isOpened={brukKontonummer}>
                        <TextField
                            label="Kontonummer"
                            disabled={lockedMode || !brukKontonummer}
                            value={personalia.kontonummer}
                            onChange={(evt) => setPersonalia({ ...personalia, kontonummer: evt.target.value })}
                        />
                    </Collapse>
                </Fieldset>
            </GruppeStyle>
            <GruppeStyle>
                <Heading level="2" size="medium" spacing>
                    Bostedsadresse
                </Heading>
                <Adresse lockedMode={lockedMode} state={adresseState} dispatch={dispatchAdresse} />
            </GruppeStyle>
            <GruppeStyle>
                <Heading level="2" size="medium" spacing>
                    Arbeidsforhold
                </Heading>
                <ArbeidsforholdSkjema
                    arbeidsforhold={personalia.arbeidsforhold}
                    onChange={(arbeidsforhold: ArbeidsforholdObject[]) =>
                        setPersonalia((personalia) => ({ ...personalia, arbeidsforhold }))
                    }
                    lockedMode={lockedMode}
                />
            </GruppeStyle>
            <GruppeStyle>
                <Heading level="2" size="medium" spacing>
                    Familiesituasjon
                </Heading>
                <StyledSelect
                    label="Sivilstand"
                    disabled={lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, sivilstand: evt.target.value })}
                    value={personalia.sivilstand}
                >
                    {Object.entries(Sivilstand).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </StyledSelect>
                <StyledSelect
                    label="Ektefelle"
                    disabled={lockedMode}
                    onChange={(evt) => setPersonalia({ ...personalia, ektefelle: evt.target.value })}
                    value={personalia.ektefelle}
                >
                    <option value="INGEN">Ingen</option>
                    <option value="EKTEFELLE_SAMME_BOSTED">Samme bosted</option>
                    <option value="EKTEFELLE_ANNET_BOSTED">Annet bosted</option>
                    <option value="EKTEFELLE_MED_ADRESSEBESKYTTELSE">Med adressebeskyttelse</option>
                </StyledSelect>
                <BarnSkjema
                    barn={personalia.barn}
                    setBarn={(barn: FrontendBarn[]) => setPersonalia((personalia) => ({ ...personalia, barn }))}
                    lockedMode={lockedMode}
                />
            </GruppeStyle>
            <GruppeStyle>
                <Heading level="2" size="medium" spacing>
                    Inntekt og formue
                </Heading>
                <SkatteutbetalingerSkjema
                    skattetatenUtbetalinger={personalia.skattetatenUtbetalinger}
                    onChange={(skattetatenUtbetalinger) =>
                        setPersonalia((personalia) => ({ ...personalia, skattetatenUtbetalinger }))
                    }
                    lockedMode={lockedMode}
                />
                <Fieldset legend="Husbanken">
                    <BostotteSakSkjema
                        bostotteSaker={personalia.bostotteSaker}
                        onChange={(bostotteSaker: SakerDto[]) =>
                            setPersonalia((personalia) => ({ ...personalia, bostotteSaker }))
                        }
                        lockedMode={lockedMode}
                    />
                    <BostotteUtbetalingSkjema
                        bostotteUtbetalinger={personalia.bostotteUtbetalinger}
                        onChange={(bostotteUtbetalinger) =>
                            setPersonalia((personalia) => ({ ...personalia, bostotteUtbetalinger }))
                        }
                        lockedMode={lockedMode}
                    />
                </Fieldset>
                <UtbetalingerSkjema
                    utbetalingerFraNav={personalia.utbetalingerFraNav}
                    onChange={(utbetalingerFraNav) =>
                        setPersonalia((personalia) => ({ ...personalia, utbetalingerFraNav }))
                    }
                    lockedMode={lockedMode}
                />
                <Fieldset legend="Administrator roller">
                    {editAdministratorRoller ? (
                        <AdministratorRollerPanel
                            initialRoller={administratorRoller}
                            setRoller={(roller: FrontendPersonaliaAdministratorRollerItem[]) => {
                                setAdministratorRoller(roller);
                                setEditAdministratorRoller(false);
                            }}
                        />
                    ) : (
                        <VisAdministratorRoller
                            lockedMode={lockedMode}
                            roller={administratorRoller}
                            setIsEditing={() => setEditAdministratorRoller(true)}
                            onSlett={() => setAdministratorRoller([])}
                        />
                    )}
                </Fieldset>
            </GruppeStyle>
            {
                /*midlertidig løsning, bør ha validering på felter som kan feile*/
                appStatus.status === 'postError' && <Alert variant="error">{appStatus.errorMessage}</Alert>
            }
            <div className={'flex gap-4'}>
                {!lockedMode && (
                    <Button variant="primary" onClick={onCreateUser}>
                        {editMode ? 'Lagre endringer' : 'Opprett bruker'} {isLoginSession(params) && ' og logg inn'}
                    </Button>
                )}
                <Button
                    variant="secondary"
                    onClick={(event: ClickEvent): void => {
                        navigate('/' + addParams(params));
                        event.preventDefault();
                    }}
                >
                    {lockedMode ? 'Tilbake' : 'Avbryt'}
                </Button>
            </div>
        </>
    );
};
