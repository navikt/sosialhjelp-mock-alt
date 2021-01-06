import Panel from "nav-frontend-paneler";
import {Sidetittel} from "nav-frontend-typografi";
import React, {useEffect, useState} from "react";
import {Input, Select, SkjemaGruppe} from "nav-frontend-skjema";
import {Hovedknapp} from "nav-frontend-knapper";
import {getMockAltApiURL} from "../../utils/restUtils";
import {useLocation} from "react-router-dom";
import {Personalia} from "../person/PersonMockData";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Feilkonfiurerasjon {
    fnr: string,
    timeout: number,
    timeoutSansynlighet: number,
    feilkode: number,
    feilmelding: string,
    feilkodeSansynlighet: number,
    className: string,
    functionName: string,
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Feilkonfiurering = () => {
    const [fnr, setFnr] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false)
    const [lockedMode, setLockedMode] = useState<boolean>(false)
    const [klasse, setKlasse] = useState<string>("*")
    const [feilkode, setFeilkode] = useState<number>(0)
    const [feilkodeSansynlighet, setFeilkodeSansynlighet] = useState<number>(100)
    const [feilmelding, setFeilmelding] = useState<string>("Manuelt konfigurert feil!")
    const [timeout, setTimeout] = useState<number>(0)
    const [timeoutSansynlighet, setTimeoutSansynlighet] = useState<number>(100)
    const [funksjon, setFunksjon] = useState<string>("*")
    const [navn, setNavn] = useState<string>("")

    const queryFnr = useQuery().get("brukerID");

    useEffect(() => {
        if (queryFnr !== null && queryFnr.length > 1) {
            setFnr(queryFnr);
            setEditMode(true);
        }
        if (fnr && fnr.length > 10) {
            fetch(`${getMockAltApiURL()}/pdl/download_url?ident=` + fnr)
                .then((response) => response.text())
                .then((text) => {
                    if (text.length > 1) {
                        const nedlastet: Personalia = JSON.parse(text);
                        setLockedMode(nedlastet.locked);
                        setNavn(nedlastet.navn.fornavn + " " + nedlastet.navn.mellomnavn + " " + nedlastet.navn.etternavn);
                    }
                })
                .catch((error) => console.log(error));
            fetch(`${getMockAltApiURL()}/feil/hent_feil?ident=` + fnr)
                .then((response) => response.text())
                .then((text) => {
                    if (text.length > 1) {
                        const nedlastet: Feilkonfiurerasjon = JSON.parse(text);
                        setTimeout(nedlastet.timeout);
                        setTimeoutSansynlighet(nedlastet.timeoutSansynlighet);
                        setFeilkode(nedlastet.feilkode);
                        setFeilkodeSansynlighet(nedlastet.feilkodeSansynlighet);
                        setFeilmelding(nedlastet.feilmelding);
                        setKlasse(nedlastet.className);
                        setFunksjon(nedlastet.functionName);
                    }
                })
                .catch((error) => console.log(error));
        }
    }, [fnr, queryFnr]);

    const onCreateFeilkonfigurering = (event: ClickEvent): void => {
        const feilkonfiurerasjon: Feilkonfiurerasjon = {
            fnr: fnr,
            timeout: timeout,
            timeoutSansynlighet: timeoutSansynlighet,
            feilkode: feilkode,
            feilmelding: feilmelding,
            feilkodeSansynlighet: feilkodeSansynlighet,
            className: klasse,
            functionName: funksjon,
        }
        fetch(`${getMockAltApiURL()}/feil/edit_feil`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feilkonfiurerasjon),
        }).then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
        event.preventDefault()
    }

    return (
        <Panel border>
            <Sidetittel>Feilsituasjoner</Sidetittel>

            <SkjemaGruppe legend="">
                <Input value={fnr}
                       label="BrukerID"
                       disabled={lockedMode || editMode}
                       onChange={(evt: any) => setFnr(evt.target.value)}
                />
            </SkjemaGruppe>
            {navn != null && navn.length > 0 &&
            <p>({navn})</p>
            }
            <SkjemaGruppe legend="Feilsituasjon">
                <Input value={feilkode}
                       label="Feilkode"
                       disabled={lockedMode}
                       onChange={(evt: any) => setFeilkode(evt.target.value)}
                />
                <Input value={feilkodeSansynlighet}
                       label="Sansynlighet for å få feilkode"
                       disabled={lockedMode}
                       onChange={(evt: any) => setFeilkodeSansynlighet(evt.target.value)}
                />
                <Input value={feilmelding}
                       label="Feilmelding"
                       disabled={lockedMode}
                       onChange={(evt: any) => setFeilmelding(evt.target.value)}
                />
                <Input value={timeout}
                       label="Timeout"
                       disabled={lockedMode}
                       onChange={(evt: any) => setTimeout(evt.target.value)}
                />
                <Input value={timeoutSansynlighet}
                       label="Sansynlighet for å få timeout"
                       disabled={lockedMode}
                       onChange={(evt: any) => setTimeoutSansynlighet(evt.target.value)}
                />
            </SkjemaGruppe>
            <SkjemaGruppe legend="Gjelder for">
                <Select label="Klasse"
                        disabled={lockedMode}
                        onChange={(evt: any) => setKlasse(evt.target.value)}
                        value={klasse}
                >
                    <option value="*">* Alle *</option>
                    <option value="FixController">Fiks</option>
                </Select>
                <Select label="Funksjon"
                        disabled={lockedMode}
                        onChange={(evt: any) => setFunksjon(evt.target.value)}
                        value={funksjon}
                >
                    <option value="*">* Alle *</option>
                    {klasse === "FixController" && (
                        <>
                            <option value="lastOppSoknad">Last opp søknad</option>
                            <option value="hentSoknad">Hent søknad</option>
                            <option value="lastOpp">Last opp dokument</option>
                            <option value="hentDokument">Hent dokument</option>
                            <option value="kommuneinfo">Hent kommuneinfo</option>
                        </>
                    )}
                </Select>
            </SkjemaGruppe>
            <Hovedknapp
                disabled={lockedMode}
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateFeilkonfigurering(event)}
            >
                Sett feilkonfigurasjon
            </Hovedknapp>
        </Panel>
    )
}
