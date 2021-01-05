import Panel from 'nav-frontend-paneler';
import {SkjemaGruppe} from 'nav-frontend-skjema';
import {Sidetittel} from 'nav-frontend-typografi';
import React, {useEffect, useState} from 'react';
import {getMockAltApiURL} from '../utils/restUtils';
import {Personalia} from "./person/PersonMockData";
import {Link} from "react-router-dom";

export const Oversikt = () => {
    const [personliste, setPersonListe] = useState([]);
    const [mockAltDefaultFnr, setMockAltDefaultFnr] = useState<string | undefined>(undefined);

    const href = window.location.href;
    const params = href.slice(href.indexOf('?') + 1, href.length);
    console.log('params', params);

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/fast/fnr`)
            .then((response) => response.text())
            .then((text) => {
                setMockAltDefaultFnr(text);
            });
        fetch(`${getMockAltApiURL()}/pdl/person_liste`)
            .then((response) => response.json())
            .then((json) => setPersonListe(json));
    }, []);

    return (
        <Panel border>
            <Sidetittel>Oversikt</Sidetittel>
            <SkjemaGruppe legend="">
                {personliste && personliste.length > 0 && (
                    personliste.map((bruker:Personalia) => {
                        return <div>
                            {bruker.navn.fornavn + " " + bruker.navn.mellomnavn +
                            " " + bruker.navn.etternavn +" (" + bruker.fnr + ")"}
                            <Link to={"/person?brukerID=" + bruker.fnr}>{bruker.locked ? "Se på" : "Edit"}</Link>
                            {mockAltDefaultFnr === bruker.fnr &&
                                <b> Default</b>
                            }
                        </div>;
                    })
                )}
                <div>
                    <Link to={"/person"}>Opprett ny bruker</Link>
                </div>
            </SkjemaGruppe>
        </Panel>
    );
};
