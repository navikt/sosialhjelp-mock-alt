import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input, Select } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { StyledPanel } from '../../../styling/Styles';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum BostotteStatus {
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    VEDTATT = 'VEDTATT',
}

export enum BostotteRolle {
    HOVEDPERSON = 'HOVEDPERSON',
    BIPERSON = 'BIPERSON',
}

export enum Vedtakskode {
    V00 = 'Søknaden din er innvilget.',
    V02 = 'Du har fått avslag på søknaden din om bostøtte fordi du eller andre i husstanden ikke har rett til bostøtte.',
    V03 = 'Du har fått avslag på søknaden din om bostøtte fordi du/dere hadde for høy inntekt.',
    V04 = 'Du har fått avslag på søknaden din om bostøtte fordi boligen din ikke oppfyller kravene.',
    V05 = 'Du har fått avslag på søknaden din om bostøtte fordi du ikke var registrert på søknadsadressen i folkeregisteret.',
    V07 = 'Klagen din ble avvist da den ble sendt inn etter klagefristen.',
    V09 = 'Søknaden din om bostøtte er avvist fordi det mangler opplysninger eller dokumentasjon, eller fordi noen i husstanden er registrert på en annen søknad.',
    V11 = 'Hovedperson er død',
    V12 = 'For høy anslått inntekt (ikke i bruk lengere)',
    V48 = 'Søknaden din om bostøtte er avvist fordi noen du bor sammen med ikke er registrert på adressen i folkeregisteret.',
}

export interface BostotteSakObject {
    mnd: string;
    ar: string;
    status: string;
    rolle: string;
    vedtak: VedtakObject | null;
}

export interface VedtakObject {
    kode: string;
    beskrivelse: string;
    type: string;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

function getVedtakskode(vedtak: Vedtakskode): string {
    return vedtak.toString();
}
function getVedtaksbeskrivelse(vedtak: Vedtakskode): string {
    switch (vedtak) {
        case Vedtakskode.V00:
            return 'Søknaden din er innvilget.';
        case Vedtakskode.V02:
            return 'Du har fått avslag på søknaden din om bostøtte fordi du eller andre i husstanden ikke har rett til bostøtte.';
        case Vedtakskode.V03:
            return 'Du har fått avslag på søknaden din om bostøtte fordi du/dere hadde for høy inntekt.';
        case Vedtakskode.V04:
            return 'Du har fått avslag på søknaden din om bostøtte fordi boligen din ikke oppfyller kravene.';
        case Vedtakskode.V05:
            return 'Du har fått avslag på søknaden din om bostøtte fordi du ikke var registrert på søknadsadressen i folkeregisteret.';
        case Vedtakskode.V07:
            return 'Klagen din ble avvist da den ble sendt inn etter klagefristen.';
        case Vedtakskode.V09:
            return 'Søknaden din om bostøtte er avvist fordi det mangler opplysninger eller dokumentasjon, eller fordi noen i husstanden er registrert på en annen søknad.';
        case Vedtakskode.V11:
            return 'Hovedperson er død';
        case Vedtakskode.V12:
            return 'For høy anslått inntekt (ikke i bruk lengere)';
        case Vedtakskode.V48:
            return 'Søknaden din om bostøtte er avvist fordi noen du bor sammen med ikke er registrert på adressen i folkeregisteret.';
        default:
            throw new Error('Ukjent vedtakskode: ' + vedtak);
    }
}
function getVedtakstype(vedtak: Vedtakskode): string {
    return vedtak === Vedtakskode.V00 ? 'INNVILGET' : 'AVSLAG';
}

export const NyBostotteSak = ({ isOpen, callback }: Params) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [ar, setAr] = useState<number>(sistManed.getFullYear());
    const [mnd, setMnd] = useState<number>(sistManed.getMonth() + 1);
    const [status, setStatus] = useState<BostotteStatus>(BostotteStatus.UNDER_BEHANDLING);
    const [rolle, setRolle] = useState<BostotteRolle>(BostotteRolle.HOVEDPERSON);
    const [vedtaksKode, setVedtaksKode] = useState<Vedtakskode>(Vedtakskode.V00);

    const onLagre = (event: ClickEvent) => {
        if (status === BostotteStatus.VEDTATT) {
            const kode = getVedtakskode(vedtaksKode);
            const beskrivelse = getVedtaksbeskrivelse(vedtaksKode);
            const type = getVedtakstype(vedtaksKode);
            const vedtaket: VedtakObject = { kode, beskrivelse, type };
            const nyttBostotteSakObject: BostotteSakObject = {
                ar: ar.toString(),
                mnd: mnd.toString(),
                status: status.toString(),
                rolle: rolle.toString(),
                vedtak: vedtaket,
            };
            callback(nyttBostotteSakObject);
        } else {
            const nyttBostotteSakObject: BostotteSakObject = {
                ar: ar.toString(),
                mnd: mnd.toString(),
                status: status.toString(),
                rolle: rolle.toString(),
                vedtak: null,
            };
            callback(nyttBostotteSakObject);
        }
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <StyledPanel>
                <Input label="År" value={ar} onChange={(evt: any) => setAr(evt.target.value)} />
                <Input label="Måned" value={mnd} onChange={(evt: any) => setMnd(evt.target.value)} />
                <Select label="Status" onChange={(evt: any) => setStatus(evt.target.value)} value={status}>
                    <option value={BostotteStatus.VEDTATT}>Vedtak er fattet</option>
                    <option value={BostotteStatus.UNDER_BEHANDLING}>Under behandling</option>
                </Select>
                <Collapse isOpened={status === BostotteStatus.VEDTATT}>
                    <Panel>
                        <Select
                            label="Vedtak"
                            onChange={(evt: any) => setVedtaksKode(evt.target.value)}
                            value={vedtaksKode}
                        >
                            <option value={Vedtakskode.V00}>{getVedtaksbeskrivelse(Vedtakskode.V00)}</option>
                            <option value={Vedtakskode.V02}>{getVedtaksbeskrivelse(Vedtakskode.V02)}</option>
                            <option value={Vedtakskode.V03}>{getVedtaksbeskrivelse(Vedtakskode.V03)}</option>
                            <option value={Vedtakskode.V04}>{getVedtaksbeskrivelse(Vedtakskode.V04)}</option>
                            <option value={Vedtakskode.V05}>{getVedtaksbeskrivelse(Vedtakskode.V05)}</option>
                            <option value={Vedtakskode.V07}>{getVedtaksbeskrivelse(Vedtakskode.V07)}</option>
                            <option value={Vedtakskode.V09}>{getVedtaksbeskrivelse(Vedtakskode.V09)}</option>
                            <option value={Vedtakskode.V11}>{getVedtaksbeskrivelse(Vedtakskode.V11)}</option>
                            <option value={Vedtakskode.V12}>{getVedtaksbeskrivelse(Vedtakskode.V12)}</option>
                            <option value={Vedtakskode.V48}>{getVedtaksbeskrivelse(Vedtakskode.V48)}</option>
                        </Select>
                    </Panel>
                </Collapse>
                <Select label="Rolle" onChange={(evt: any) => setRolle(evt.target.value)} value={rolle}>
                    <option value={BostotteRolle.HOVEDPERSON}>Hovedperson</option>
                    <option value={BostotteRolle.BIPERSON}>Biperson</option>
                </Select>
                <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                    Legg til
                </Knapp>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                    className="leftPadding"
                >
                    Avbryt
                </Knapp>
            </StyledPanel>
        </Collapse>
    );
};

interface ViseParams {
    bostotteSak: BostotteSakObject;
}

export const VisBostotteSak = ({ bostotteSak }: ViseParams) => {
    return (
        <StyledPanel>
            <div>År: {bostotteSak.ar}</div>
            <div>Måned: {bostotteSak.mnd}</div>
            <div>Status: {bostotteSak.status}</div>
            {bostotteSak.status === BostotteStatus.VEDTATT && (
                <div>
                    <div>Ident: {bostotteSak.vedtak?.beskrivelse}</div>
                </div>
            )}
            <div>Rolle: {bostotteSak.rolle}</div>
        </StyledPanel>
    );
};
