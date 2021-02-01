import {Hovedknapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {addParams, getMockAltApiURL, getRedirectParams} from '../../utils/restUtils';
import {Personalia} from "../person/PersonMockData";
import {Link} from "react-router-dom";

export const Login = () => {
    const [fnr, setFnr] = useState('');
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
        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}${addParams(params,"&")}`;
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
            <Hovedknapp onClick={() => handleOnClick()}>
                Login
            </Hovedknapp>
            <Link className="knapp leftPadding" to={"/person" + addParams(params)} type="knapp">Lag ny bruker</Link>
            <Link className="knapp leftPadding" to={"/" + addParams(params)}>Gå til oversikten</Link>
        </Panel>
    );
};
