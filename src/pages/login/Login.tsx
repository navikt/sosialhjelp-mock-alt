import {Hovedknapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {
    addParams,
    getInnsynURL,
    getMockAltApiURL,
    getModiaURL,
    getRedirectParams,
    getSoknadURL,
    isLoginSession
} from '../../utils/restUtils';
import {Personalia} from "../person/PersonMockData";
import {Link} from "react-router-dom";

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [redirect, setRedirect] = useState(getSoknadURL());
    const [personliste, setPersonListe] = useState<Personalia[]>([]);

    const params = getRedirectParams();

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setFnr(text);
            });
        fetch(`${getMockAltApiURL()}/mock-alt/personalia/liste`)
            .then((response) => response.json())
            .then((json) => setPersonListe(json));
    }, []);

    const handleOnClick = () => {
        var queryString = addParams(params, "&")
        if(!isLoginSession(params)) {
            queryString = "&redirect=" + redirect;
        }
        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}${queryString}`;

    };

    return (
        <Panel border>
            <Sidetittel>Mock login</Sidetittel>
            <SkjemaGruppe legend="">
                    <Select
                        onChange={(event) => setFnr(event.target.value)}
                        label="Velg bruker"
                        value={fnr}
                    >
                        {personliste.map((bruker) => {
                            return (
                                <option key={bruker.fnr} value={bruker.fnr}>
                                    {bruker.navn.fornavn + " " + bruker.navn.mellomnavn + " " + bruker.navn.etternavn + " (" + bruker.fnr + ")"}
                                </option>
                            );
                        })}
                    </Select>
            </SkjemaGruppe>
            {!isLoginSession(params) &&
                <Select
                    onChange={(event) => setRedirect(event.target.value)}
                    label="Velg tjeneste"
                    value={redirect}
                >
                    <option key="soknaden" value={getSoknadURL()}>
                        Søknaden
                    </option>
                    <option key="innsyn" value={getInnsynURL()}>
                        Innsyn
                    </option>
                    <option key="modia" value={getModiaURL()}>
                        Modia
                    </option>
                </Select>
            }
            <Hovedknapp onClick={() => handleOnClick()}>
                Login
            </Hovedknapp>
            <Link className="knapp leftPadding" to={"/person" + addParams(params)} type="knapp">Lag ny bruker</Link>
            <Link className="knapp leftPadding" to={"/" + addParams(params)}>Gå til oversikten</Link>
        </Panel>
    );
};
