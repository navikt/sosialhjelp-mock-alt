import * as React from 'react';
import { Checkbox, Input, Select, SkjemaGruppe } from 'nav-frontend-skjema';
import { Collapse } from 'react-collapse';
import { useEffect, useState } from 'react';
import { BarnObject, NyttBarn, VisBarn } from './barn/Barn';
import { useQuery } from './PersonMockData';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    lockedMode: boolean;
    fnr: string;

}
const Personalia = (props: Props) => {
    const [fornavn, setFornavn] = useState<string>("Ukjent");
    const [mellomnavn, setMellomnavn] = useState<string>("");
    const [etternavn, setEtternavn] = useState<string>("Mockperson");
    const [addressebeskyttelse, setAddressebeskyttelse] = useState<string>("UGRADERT");
    const [sivilstand, setSivilstand] = useState<string>("UOPPGITT");
    const [ektefelle, setEktefelle] = useState<string>("INGEN");
    const [starsborgerskap, setStatsborgerskap] = useState<string>("NOR");

    const [brukTelefonnummer, setBrukTelefonnummer] = useState<boolean>(false)
    const [telefonnummer, setTelefonnummer] = useState<string>("99999999")
    const [brukOrganisasjon, setBrukOrganisasjon] = useState<boolean>(false)
    const [organisasjon, setOrganisasjon] = useState<string>("")
    const [organisasjonsNavn, setOrganisasjonsNavn] = useState<string>("Organisasjonsnavn")


    const [leggTilBarn, setLeggTilBarn] = useState<boolean>(false)
    const [barn, setBarn] = useState<BarnObject[]>([])
    //const queryFnr = useQuery().get("brukerID");


    const leggTilBarnCallback = (nyttTilBarn: BarnObject) => {
        if (nyttTilBarn) {
            barn.push(nyttTilBarn);
            setBarn(barn);
        }
        setLeggTilBarn(false)
    };

    return (
        <SkjemaGruppe legend="Personalia">
            <Input
                label="Fornavn"
                disabled={props.lockedMode}
                value={fornavn}
                onChange={(evt: any) => setFornavn(evt.target.value)}
            />
            <Input
                label="Mellomnavn"
                disabled={props.lockedMode}
                value={mellomnavn}
                onChange={(evt: any) => setMellomnavn(evt.target.value)}
            />
            <Input
                label="Etternavn"
                disabled={props.lockedMode}
                value={etternavn}
                onChange={(evt: any) => setEtternavn(evt.target.value)}
            />
            <Select
                label="Addressebeskyttelse"
                disabled={props.lockedMode}
                onChange={(evt: any) => setAddressebeskyttelse(evt.target.value)}
                value={addressebeskyttelse}
            >
                <option value="UGRADERT">Ugradert</option>
                <option value="STRENGT_FORTROLIG">Strengt fortrolig (kode 6)</option>
                <option value="STRENGT_FORTROLIG_UTLAND">Strengt fortrolig utland (kode 6)</option>
                <option value="FORTROLIG">Fortrolig (kode 7)</option>
            </Select>
            <Select
                label="Sivilstand"
                disabled={props.lockedMode}
                onChange={(evt: any) => setSivilstand(evt.target.value)}
                value={sivilstand}
            >
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
            <Select
                label="Ektefelle"
                disabled={props.lockedMode}
                onChange={(evt: any) => setEktefelle(evt.target.value)}
                value={ektefelle}
            >
                <option value="INGEN">-</option>
                <option value="EKTEFELLE_SAMME_BOSTED">EKTEFELLE_SAMME_BOSTED</option>
                <option value="EKTEFELLE_ANNET_BOSTED">EKTEFELLE_ANNET_BOSTED</option>
                <option value="EKTEFELLE_MED_ADRESSEBESKYTTELSE">EKTEFELLE_MED_ADRESSEBESKYTTELSE</option>
            </Select>
            <SkjemaGruppe legend="Barn">
                <NyttBarn isOpen={leggTilBarn} callback={leggTilBarnCallback} />
                {barn.map((barn: BarnObject, index: number) => {
                    return <VisBarn barn={barn} key={'barn_' + index} />;
                })}
                {!leggTilBarn && <Knapp onClick={() => setLeggTilBarn(true)}>Legg til barn</Knapp>}
            </SkjemaGruppe>
            <Select
                label="Statsborgerskap"
                disabled={props.lockedMode}
                onChange={(evt: any) => setStatsborgerskap(evt.target.value)}
                value={starsborgerskap}
            >
                <option value="NOR">Norsk</option>
                <option value="SWE">Svensk</option>
                <option value="DEN">Dansk</option>
                <option value="GER">Tysk</option>
                <option value="USA">Amerikansk</option>
                <option value="XXX">Statsløs</option>
                <option value="XUK">Ukjent/Mangler opplysninger</option>
            </Select>
            <SkjemaGruppe legend="Telefonnummer">
                <Checkbox
                    label="Sett telefonnummer"
                    disabled={props.lockedMode}
                    onChange={(evt: any) => setBrukTelefonnummer(evt.target.checked)}
                    value={brukTelefonnummer ? 'true' : 'false'}
                />
                <Collapse isOpened={brukTelefonnummer}>
                    <Input
                        label="Telefonnummer"
                        disabled={props.lockedMode || !brukTelefonnummer}
                        value={telefonnummer}
                        onChange={(evt: any) => setTelefonnummer(evt.target.value)}
                    />
                </Collapse>
            </SkjemaGruppe>
            <SkjemaGruppe legend="Organisasjon">
                <Checkbox
                    label="Sett organisasjon"
                    disabled={props.lockedMode}
                    onChange={(evt: any) => setBrukOrganisasjon(evt.target.checked)}
                    value={brukOrganisasjon ? 'true' : 'false'}
                />
                <Collapse isOpened={brukOrganisasjon}>
                    <Input
                        label="Organisasjonsnavn"
                        disabled={props.lockedMode || !brukOrganisasjon}
                        value={organisasjonsNavn}
                        onChange={(evt: any) => setOrganisasjonsNavn(evt.target.value)}
                    />
                    <Input
                        label="Organisasjonsnummer"
                        disabled={props.lockedMode || !brukOrganisasjon}
                        value={organisasjon}
                        onChange={(evt: any) => setOrganisasjon(evt.target.value)}
                    />
                </Collapse>
            </SkjemaGruppe>
        </SkjemaGruppe>
    );
};
export default Personalia;
