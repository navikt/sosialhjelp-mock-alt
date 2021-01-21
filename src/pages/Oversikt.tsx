import Panel from 'nav-frontend-paneler';
import {SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {addParams, getMockAltApiURL, getRedirectParams} from '../utils/restUtils';
import {Personalia} from "./person/PersonMockData";
import {Link} from "react-router-dom";

export const Oversikt = () => {
    const [personliste, setPersonListe] = useState([]);
    const [mockAltDefaultFnr, setMockAltDefaultFnr] = useState<string | undefined>(undefined);

    const params = getRedirectParams();

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setMockAltDefaultFnr(text);
            });
        fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`)
            .then((response) => response.json())
            .then((json) => setPersonListe(json));
    }, []);

    return (
        <Panel border>
            <Sidetittel>Oversikt</Sidetittel>
            <SkjemaGruppe legend="">
                {
                    personliste.map((bruker: Personalia) => {
                        return <div key={bruker.fnr}>
                            {bruker.navn.fornavn + " " + bruker.navn.mellomnavn +
                            " " + bruker.navn.etternavn + " (" + bruker.fnr + ")"}
                            <Link to={"/person?brukerID=" + bruker.fnr + addParams(params, "&")}>{bruker.locked ? "Se på" : "Edit"}</Link>
                            {" "}
                            <Link to={"/feil?brukerID=" + bruker.fnr + addParams(params, "&")}>Feil?</Link>
                            {mockAltDefaultFnr === bruker.fnr && <b> Default</b>}
                        </div>;
                    })
                }
                <div>
                    <Link to={"/person" + addParams(params)}>Opprett ny bruker</Link>
                </div>
            </SkjemaGruppe>
        </Panel>
    );
};
