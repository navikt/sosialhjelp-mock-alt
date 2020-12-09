import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { Sidetittel, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

export const SoknadMock = () => {
    return (
        <Panel border>
            <Sidetittel>Mock systemdata med mock-alt</Sidetittel>
            <AlertStripe type="advarsel">
                DETTE ER KUN FOR TESTING! Data du legger inn her er tilgjengelig for alle. Ikke legg inn noe sensitiv
                informasjon!
            </AlertStripe>
            <Undertittel>Soknad mock login</Undertittel>

            <SkjemaGruppe legend="">
                <Input defaultValue={Math.round(Math.random() * 99999999999).toString()} label="BrukerID" />
            </SkjemaGruppe>

            <SkjemaGruppe legend="Personalia">
                <Input label="Fornavn" />
                <Input label="Mellomnavn" />
                <Input label="Etternavn" />
                <Select label="Addressebeskyttelse">
                    <option value="UGRADERT">Ugradert</option>
                    <option value="STRENGT_FORTROLIG">Strengt fortrolig (kode 6)</option>
                    <option value="STRENGT_FORTROLIG_UTLAND">Strengt fortrolig utland (kode 6)</option>
                    <option value="FORTROLIG">Fortrolig (kode 7)</option>
                </Select>
                <Select label="Sivilstand">
                    <option value="UOPPGITT">UOPPGITT</option>
                    <option value="UGIFT">UGIFT</option>
                    <option value="GIFT">GIFT</option>
                    <option value="ENKE_ELLER_ENKEMANN">ENKE_ELLER_ENKEMANN</option>
                    <option value="SKILT">SKILT</option>
                    <option value="SEPARERT">SEPARERT</option>
                    <option value="PARTNER">PARTNER</option>
                    <option value="SEPARERT_PARTNER">SEPARERT_PARTNER</option>
                    <option value="SKILT_PARTNER">SKILT_PARTNER</option>
                    <option value="GJENLEVENDE_PARTNER">GJENLEVENDE_PARTNER</option>
                </Select>
                <Select label="Statsborgerskap">
                    <option value="NOR">Norsk</option>
                    <option value="SWE">Svensk</option>
                    <option value="DEN">Dansk</option>
                    <option value="GER">Tysk</option>
                    <option value="USA">Amerikansk</option>
                    <option value="xxx">Statsløs</option>
                    <option value="???">Mangler opplysninger</option>
                </Select>
            </SkjemaGruppe>

            <Hovedknapp>Sett systemdata</Hovedknapp>
        </Panel>
    );
};
