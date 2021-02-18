import Panel from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { addParams, getMockAltApiURL, getRedirectParams } from '../../utils/restUtils';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Personalia } from '../person/PersonMockData';
import { Collapse } from 'react-collapse';
import styled from 'styled-components/macro';
import { Bold, theme } from '../../styling/Styles';
import AlertStripe from 'nav-frontend-alertstriper';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface FeilsituasjonerFrontend {
    fnr: string;
    feilsituasjoner: Feilkonfiurerasjon[];
}

interface Feilkonfiurerasjon {
    fnr: string;
    timeout: number;
    timeoutSansynlighet: number;
    feilkode: number;
    feilmelding: string;
    feilkodeSansynlighet: number;
    className: string;
    functionName: string;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Wrapper = styled(Panel)`
    h1 {
        margin-bottom: 1rem;
    }
    .alertstripe {
        margin-bottom: 1rem;
    }
    .feilsituasjon {
        margin-bottom: 1rem;
    }
`;

const ConfigPanel = styled(Panel)`
    margin-bottom: 1rem;
`;

const Knappegruppe = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    button,
    a {
        margin-right: 1rem;
        white-space: normal;

        @media ${theme.mobile} {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
`;

export const Feilkonfiurering = () => {
    const [leggTilFeil, setLeggTilFeil] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [lockedMode, setLockedMode] = useState<boolean>(false);
    const [klasse, setKlasse] = useState<string>('*');
    const [feilkode, setFeilkode] = useState<number>(0);
    const [feilkodeSansynlighet, setFeilkodeSansynlighet] = useState<number>(100);
    const [feilmelding, setFeilmelding] = useState<string>('Manuelt konfigurert feil!');
    const [timeout, setTimeout] = useState<number>(0);
    const [timeoutSansynlighet, setTimeoutSansynlighet] = useState<number>(100);
    const [funksjon, setFunksjon] = useState<string>('*');
    const [navn, setNavn] = useState<string>('');

    const [fnr, setFnr] = useState<string>('');
    const [feilsituasjoner, setFeilsituasjoner] = useState<Feilkonfiurerasjon[]>([]);

    const queryFnr = useQuery().get('brukerID');
    const params = getRedirectParams();
    const history = useHistory();

    useEffect(() => {
        if (queryFnr !== null && queryFnr.length > 1) {
            setFnr(queryFnr);
            setEditMode(true);
        }
    }, [queryFnr]);

    useEffect(() => {
        if (fnr && fnr.length > 10) {
            fetch(`${getMockAltApiURL()}/mock-alt/personalia?ident=` + fnr)
                .then((response) => response.text())
                .then((text) => {
                    if (text.length > 1) {
                        const nedlastet: Personalia = JSON.parse(text);
                        setLockedMode(nedlastet.locked);
                        setNavn(
                            nedlastet.navn.fornavn + ' ' + nedlastet.navn.mellomnavn + ' ' + nedlastet.navn.etternavn
                        );
                    }
                })
                .catch((error) => console.log(error));
            fetch(`${getMockAltApiURL()}/feil?ident=` + fnr)
                .then((response) => response.text())
                .then((text) => {
                    if (text.length > 1) {
                        const nedlastet: FeilsituasjonerFrontend = JSON.parse(text);
                        setFeilsituasjoner(nedlastet.feilsituasjoner);
                    }
                })
                .catch((error) => console.log(error));
        }
    }, [fnr]);

    const onLeggTilFeilkonfigurering = (event: ClickEvent): void => {
        const feilkonfiurerasjon: Feilkonfiurerasjon = {
            fnr: fnr,
            timeout: timeout,
            timeoutSansynlighet: timeoutSansynlighet,
            feilkode: feilkode,
            feilmelding: feilmelding,
            feilkodeSansynlighet: feilkodeSansynlighet,
            className: klasse,
            functionName: funksjon,
        };
        const nyeFeilsituasjoner = feilsituasjoner;
        nyeFeilsituasjoner.push(feilkonfiurerasjon);
        setFeilsituasjoner(nyeFeilsituasjoner);
        setLeggTilFeil(false);
        event.preventDefault();
    };

    const resetFeil = (event: ClickEvent): void => {
        setFeilsituasjoner([]);
        event.preventDefault();
    };

    const onSetFeilkonfigurering = (event: ClickEvent): void => {
        const feilsituasjonerFrontend: FeilsituasjonerFrontend = {
            fnr: fnr,
            feilsituasjoner: feilsituasjoner,
        };
        fetch(`${getMockAltApiURL()}/feil`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feilsituasjonerFrontend),
        })
            .then((response) => {
                console.log(response);
                history.push('/' + addParams(params));
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

    return (
        <Wrapper border>
            <Sidetittel>Feilsituasjoner</Sidetittel>
            <Input
                value={fnr}
                label="Ident / Fødselsnummer"
                disabled={lockedMode || editMode}
                onChange={(evt: any) => setFnr(evt.target.value)}
            />
            {navn?.length > 0 && (
                <p>
                    <Bold>Navn:</Bold> {navn}
                </p>
            )}
            {feilsituasjoner.map((feil: Feilkonfiurerasjon, index: number) => {
                return (
                    <ConfigPanel border={true} key={'feil_' + index}>
                        <div>Klasse: {feil.className}</div>
                        <div>Funksjon: {feil.functionName}</div>
                        {feil.feilkode > 0 && (
                            <div>
                                <div>Feilkode: {feil.feilkode}</div>
                                <div>Feilmelding: {feil.feilmelding}</div>
                                <div>Sannsynlighet for feilkode: {feil.feilkodeSansynlighet}</div>
                            </div>
                        )}
                        {feil.timeout > 0 && (
                            <div>
                                <div>Timeout: {feil.timeout}</div>
                                <div>Sannsynlighet for timeout: {feil.timeoutSansynlighet}</div>
                            </div>
                        )}
                    </ConfigPanel>
                );
            })}
            {lockedMode ? (
                <AlertStripe type="info">Du kan ikke konfigurere feil på standardbrukere.</AlertStripe>
            ) : (
                <>
                    <Collapse isOpened={!leggTilFeil}>
                        <Knappegruppe>
                            <Knapp onClick={() => setLeggTilFeil(true)}>+ Legg til feil</Knapp>
                            {feilsituasjoner.length > 0 && (
                                <Flatknapp
                                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                        resetFeil(event)
                                    }
                                >
                                    Tøm liste
                                </Flatknapp>
                            )}
                        </Knappegruppe>
                    </Collapse>
                    <Collapse isOpened={leggTilFeil}>
                        <ConfigPanel border={true}>
                            <SkjemaGruppe legend="Feilsituasjon" className="feilsituasjon">
                                <Input
                                    value={feilkode}
                                    label="Feilkode"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setFeilkode(evt.target.value)}
                                />
                                <Input
                                    value={feilkodeSansynlighet}
                                    label="Sansynlighet for å få feilkode"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setFeilkodeSansynlighet(evt.target.value)}
                                />
                                <Input
                                    value={feilmelding}
                                    label="Feilmelding"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setFeilmelding(evt.target.value)}
                                />
                                <Input
                                    value={timeout}
                                    label="Timeout"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setTimeout(evt.target.value)}
                                />
                                <Input
                                    value={timeoutSansynlighet}
                                    label="Sansynlighet for å få timeout"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setTimeoutSansynlighet(evt.target.value)}
                                />
                            </SkjemaGruppe>
                            <SkjemaGruppe legend="Gjelder for">
                                <Select
                                    label="Klasse"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setKlasse(evt.target.value)}
                                    value={klasse}
                                >
                                    <option value="*">* Alle *</option>
                                    <option value="FixController">Fiks</option>
                                    <option value="PdlController">Pdl</option>
                                    <option value="HusbankenController">Husbanken</option>
                                    <option value="SkatteetatenController">Skatt</option>
                                </Select>
                                <Select
                                    label="Funksjon"
                                    disabled={lockedMode}
                                    onChange={(evt: any) => setFunksjon(evt.target.value)}
                                    value={funksjon}
                                >
                                    <option value="*">* Alle *</option>
                                    {klasse === 'FixController' && (
                                        <>
                                            <option value="lastOppSoknad">Last opp søknad</option>
                                            <option value="hentSoknad">Hent søknad</option>
                                            <option value="lastOpp">Last opp dokument</option>
                                            <option value="hentDokument">Hent dokument</option>
                                            <option value="kommuneinfo">Hent kommuneinfo</option>
                                        </>
                                    )}
                                    {klasse === 'PdlController' && (
                                        <>
                                            <option value="getSoknad">Alle kall fra soknad-api</option>
                                            <option value="getSoknadPerson">Hent person fra soknad-api</option>
                                            <option value="getSoknadBarn">Hent barn fra soknad-api</option>
                                            <option value="getSoknadEktefelle">Hent ektefelle fra soknad-api</option>
                                            <option value="getInnsyn">Alle kall fra modia-api</option>
                                            <option value="getModia">Alle kall fra innsyn-api</option>
                                        </>
                                    )}
                                </Select>
                            </SkjemaGruppe>
                            <Knapp
                                disabled={lockedMode}
                                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                    onLeggTilFeilkonfigurering(event)
                                }
                            >
                                Lagre
                            </Knapp>
                        </ConfigPanel>
                    </Collapse>
                </>
            )}

            <Knappegruppe>
                {!lockedMode && (
                    <Hovedknapp
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                            onSetFeilkonfigurering(event)
                        }
                    >
                        Lagreq
                    </Hovedknapp>
                )}
                <Link to={'/person?brukerID=' + fnr + addParams(params, '&')} className={'knapp knapp--standard'}>
                    {lockedMode ? 'Tilbake' : 'Avbryt'}
                </Link>
            </Knappegruppe>
        </Wrapper>
    );
};
