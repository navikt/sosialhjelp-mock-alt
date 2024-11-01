import React, { useEffect, useState } from 'react';
import { addParams, getMockAltApiURL, getRedirectParams } from '../../utils/restUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AvbrytKnapp, Knappegruppe } from '../../styling/Styles';
import { Alert, Button, BodyShort, Fieldset, Panel, Select, TextField, Heading, Label } from '@navikt/ds-react';
import { FrontendPersonalia } from '../../generated/model';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface FeilsituasjonerFrontend {
    fnr: string;
    feilsituasjoner: Feilkonfigurerasjon[];
}

interface Feilkonfigurerasjon {
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
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
`;

const ConfigPanel = styled(Panel)`
    margin-bottom: 1rem;

    .leggTilKnapp {
        margin-top: 1.5rem;
    }
`;

const FeilKnappegruppe = styled.div``;

export const Feilkonfigurering = () => {
    const [leggTilFeil, setLeggTilFeil] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [lockedMode, setLockedMode] = useState<boolean>(false);
    const [klasse, setKlasse] = useState<string>('*');
    const [feilkode, setFeilkode] = useState('0');
    const [feilkodeSansynlighet, setFeilkodeSansynlighet] = useState('100');
    const [feilmelding, setFeilmelding] = useState<string>('Manuelt konfigurert feil!');
    const [timeout, setTimeout] = useState('0');
    const [timeoutSansynlighet, setTimeoutSansynlighet] = useState('100');
    const [funksjon, setFunksjon] = useState<string>('*');
    const [navn, setNavn] = useState<string>('');

    const [fnr, setFnr] = useState<string>('');
    const [feilsituasjoner, setFeilsituasjoner] = useState<Feilkonfigurerasjon[]>([]);

    const queryFnr = useQuery().get('brukerID');
    const params = getRedirectParams();
    const navigate = useNavigate();
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
                        const nedlastet: FrontendPersonalia = JSON.parse(text);
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
        const feilkonfigurerasjon: Feilkonfigurerasjon = {
            fnr: fnr,
            timeout: parseInt(timeout),
            timeoutSansynlighet: parseInt(timeoutSansynlighet),
            feilkode: parseInt(feilkode),
            feilmelding: feilmelding,
            feilkodeSansynlighet: parseInt(feilkodeSansynlighet),
            className: klasse,
            functionName: funksjon,
        };
        const nyeFeilsituasjoner = feilsituasjoner;
        nyeFeilsituasjoner.push(feilkonfigurerasjon);
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
                navigate('/' + addParams(params));
            })
            .catch((error) => {
                console.log(error);
            });
        event.preventDefault();
    };

    const onGoBack = (event: ClickEvent): void => {
        navigate('/' + addParams(params));
        event.preventDefault();
    };

    return (
        <Wrapper>
            <Heading level="1" size="xlarge" spacing>
                Feilsituasjoner
            </Heading>
            <TextField
                value={fnr}
                label="Ident / Fødselsnummer"
                disabled={lockedMode || editMode}
                onChange={(evt) => setFnr(evt.target.value)}
            />
            {navn?.length > 0 && (
                <BodyShort>
                    <Label as="span">Navn:</Label> {navn}
                </BodyShort>
            )}
            {feilsituasjoner.map((feil: Feilkonfigurerasjon, index: number) => {
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
                <Alert variant="info">Du kan ikke konfigurere feil på standardbrukere.</Alert>
            ) : (
                <>
                    {leggTilFeil ? (
                        <ConfigPanel border={true}>
                            <Fieldset legend="Feilsituasjon" className="feilsituasjon">
                                <TextField
                                    value={feilkode}
                                    type="number"
                                    label="Feilkode"
                                    disabled={lockedMode}
                                    onChange={(evt) => setFeilkode(evt.target.value)}
                                />
                                <TextField
                                    value={feilkodeSansynlighet}
                                    type="number"
                                    label="Sansynlighet for å få feilkode"
                                    disabled={lockedMode}
                                    onChange={(evt) => setFeilkodeSansynlighet(evt.target.value)}
                                />
                                <TextField
                                    value={feilmelding}
                                    label="Feilmelding"
                                    disabled={lockedMode}
                                    onChange={(evt) => setFeilmelding(evt.target.value)}
                                />
                                <TextField
                                    value={timeout}
                                    type="number"
                                    label="Timeout"
                                    disabled={lockedMode}
                                    onChange={(evt) => setTimeout(evt.target.value)}
                                />
                                <TextField
                                    value={timeoutSansynlighet}
                                    type="number"
                                    label="Sansynlighet for å få timeout"
                                    disabled={lockedMode}
                                    onChange={(evt) => setTimeoutSansynlighet(evt.target.value)}
                                />
                            </Fieldset>
                            <Fieldset legend="Gjelder for">
                                <Select
                                    label="Klasse"
                                    disabled={lockedMode}
                                    onChange={(evt) => setKlasse(evt.target.value)}
                                    value={klasse}
                                >
                                    <option value="*">* Alle *</option>
                                    <option value="FixController">Fiks</option>
                                    <option value="PdlController">Pdl</option>
                                    <option value="NorgController">Norg</option>
                                    <option value="HusbankenController">Husbanken</option>
                                    <option value="SkatteetatenController">Skatt</option>
                                </Select>
                                <Select
                                    label="Funksjon"
                                    disabled={lockedMode}
                                    onChange={(evt) => setFunksjon(evt.target.value)}
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
                            </Fieldset>
                            <Button
                                disabled={lockedMode}
                                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                    onLeggTilFeilkonfigurering(event)
                                }
                                className="leggTilKnapp"
                            >
                                Legg til
                            </Button>
                        </ConfigPanel>
                    ) : (
                        <FeilKnappegruppe>
                            <Button variant="secondary" onClick={() => setLeggTilFeil(true)}>
                                + Legg til feil
                            </Button>
                            {feilsituasjoner.length > 0 && (
                                <Button
                                    variant="tertiary"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                        resetFeil(event)
                                    }
                                >
                                    Tøm liste
                                </Button>
                            )}
                        </FeilKnappegruppe>
                    )}
                </>
            )}
            <Knappegruppe>
                {!lockedMode && (
                    <Button
                        variant="primary"
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                            onSetFeilkonfigurering(event)
                        }
                    >
                        Lagre
                    </Button>
                )}
                <AvbrytKnapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onGoBack(event)}>
                    {lockedMode ? 'Tilbake' : 'Avbryt'}
                </AvbrytKnapp>
            </Knappegruppe>
        </Wrapper>
    );
};
