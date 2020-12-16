import {Hovedknapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {Input, Select, SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {getMockAltApiURL} from '../../utils/restUtils';

interface BrukerInfo {
    navn: string,
    fnr: string,
}

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [mockAltAlleFnr, setMockAltAlleFnr] = useState([]);
    const [mockAltDefaultFnr, setMockAltDefaultFnr] = useState<string |undefined>(undefined);
    const [mockAltTilfeldigFnr, setMockAltTilfeldigFnr] = useState<string |undefined>(undefined);

    const href = window.location.href;
    const params = href.slice(href.indexOf('?') + 1, href.length);
    console.log('params', params);

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setMockAltDefaultFnr(text);
                if(fnr.length < 1) {
                    setFnr(text);
                }
            });
        fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
            .then((response) => response.text())
            .then((text) => setMockAltTilfeldigFnr(text));
        fetch(`${getMockAltApiURL()}/fiks/alle/fnr`)
            .then((response) => response.json())
            .then((json) => setMockAltAlleFnr(json));
    }, [fnr.length]);
    var brukerListe:Array<BrukerInfo> = [];
    if(mockAltDefaultFnr) brukerListe.push({navn:"Default", fnr:mockAltDefaultFnr});
    mockAltAlleFnr.forEach((it) => {brukerListe.push({navn:it, fnr:it})})
    if(mockAltTilfeldigFnr) brukerListe.push({navn:"Nytt personnummer", fnr:mockAltTilfeldigFnr});

    const handleOnClick = () => {
        window.location.href = `${getMockAltApiURL()}/login/cookie?subject=${fnr}&${params}`;
    };
    return (
        <Panel border>
            <Sidetittel>Login</Sidetittel>
            <SkjemaGruppe legend="">
                <Input
                    onChange={(event) => setFnr(event.target.value)}
                    label="BrukerID"
                />
                {brukerListe && brukerListe.length > 0 && (
                    <Select
                        onChange={(event) => setFnr(event.target.value)}
                        label="Velg fra forhåndsdefinerte brukerIDer"
                    >
                        {brukerListe.map((bruker) => {
                            return (
                                <option key={bruker.navn} value={bruker.fnr} selected={bruker.fnr === fnr}>
                                    {bruker.navn + " (" + bruker.fnr + ")"}
                                </option>
                            );
                        })}
                    </Select>
                )}
            </SkjemaGruppe>
            <Hovedknapp onClick={() => handleOnClick()}>
                Generer token for "{fnr}" og gå tilbake til applikasjon
            </Hovedknapp>
        </Panel>
    );
};
