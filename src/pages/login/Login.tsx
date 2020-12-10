import { Hovedknapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { Sidetittel } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';

export const Login = () => {
    const [fnr, setFnr] = useState('');
    const [mockAltAlleFnr, setMockAltAlleFnr] = useState([]);

    const href = window.location.href;
    const params = href.slice(href.indexOf('?') + 1, href.length);
    console.log('params', params);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_MOCK_ALT_API}/fiks/alle/fnr`)
            .then((response) => response.json())
            .then((json) => setMockAltAlleFnr(json));
    }, []);

    const handleOnClick = () => {
        window.location.href = `${process.env.REACT_APP_MOCK_ALT_API}/login/cookie?subject=${fnr}&${params}`;
    };
    return (
        <Panel border>
            <Sidetittel>Login</Sidetittel>
            <SkjemaGruppe legend="">
                <Input onChange={(event) => setFnr(event.target.value)} label="BrukerID" />
                {mockAltAlleFnr && mockAltAlleFnr.length > 0 && (
                    <Select
                        onChange={(event) => setFnr(event.target.value)}
                        label="Velg fra forhåndsdefinerte brukerIDer"
                    >
                        {mockAltAlleFnr.map((fnr) => {
                            return (
                                <option key={fnr} value={fnr}>
                                    {fnr}
                                </option>
                            );
                        })}
                    </Select>
                )}
            </SkjemaGruppe>
            <Hovedknapp onClick={() => handleOnClick()}>Generer token og gå tilbake til applikasjon</Hovedknapp>
        </Panel>
    );
};
