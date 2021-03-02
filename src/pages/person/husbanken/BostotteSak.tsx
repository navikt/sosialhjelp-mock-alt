import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knapp } from 'nav-frontend-knapper';
import {
    DefinitionList,
    FlexWrapper,
    Knappegruppe,
    StyledInput,
    StyledPanel,
    StyledSelect,
} from '../../../styling/Styles';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum BostotteStatus {
    VEDTATT = 'VEDTATT',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
}
const getBostotteStatusLabel = (key: BostotteStatus) => {
    switch (key) {
        case 'VEDTATT':
            return 'Vedtak er fattet';
        case 'UNDER_BEHANDLING':
            return 'Under behandling';
        default:
            return '';
    }
};

export enum BostotteRolle {
    HOVEDPERSON = 'HOVEDPERSON',
    BIPERSON = 'BIPERSON',
}

export const getBostotteRolleLabel = (key: BostotteRolle) => {
    switch (key) {
        case 'HOVEDPERSON':
            return 'Hovedperson';
        case 'BIPERSON':
            return 'Biperson';
        default:
            return '';
    }
};

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
    status: BostotteStatus;
    rolle: BostotteRolle;
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
                status: status,
                rolle: rolle,
                vedtak: vedtaket,
            };
            callback(nyttBostotteSakObject);
        } else {
            const nyttBostotteSakObject: BostotteSakObject = {
                ar: ar.toString(),
                mnd: mnd.toString(),
                status: status,
                rolle: rolle,
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
                <FlexWrapper>
                    <StyledInput label="År" value={ar} onChange={(evt: any) => setAr(evt.target.value)} size={5} />
                    <StyledInput label="Måned" value={mnd} onChange={(evt: any) => setMnd(evt.target.value)} size={5} />
                </FlexWrapper>
                <StyledSelect label="Status" onChange={(evt: any) => setStatus(evt.target.value)} value={status}>
                    <option value={BostotteStatus.VEDTATT}>{getBostotteStatusLabel(BostotteStatus.VEDTATT)}</option>
                    <option value={BostotteStatus.UNDER_BEHANDLING}>
                        {getBostotteStatusLabel(BostotteStatus.UNDER_BEHANDLING)}
                    </option>
                </StyledSelect>
                {status === BostotteStatus.VEDTATT && (
                    <StyledSelect
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
                    </StyledSelect>
                )}
                <StyledSelect label="Rolle" onChange={(evt: any) => setRolle(evt.target.value)} value={rolle}>
                    <option value={BostotteRolle.HOVEDPERSON}>
                        {getBostotteRolleLabel(BostotteRolle.HOVEDPERSON)}
                    </option>
                    <option value={BostotteRolle.BIPERSON}>{getBostotteRolleLabel(BostotteRolle.BIPERSON)}</option>
                </StyledSelect>
                <Knappegruppe>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Knapp>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}>
                        Avbryt
                    </Knapp>
                </Knappegruppe>
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
            <DefinitionList>
                <dt>År</dt>
                <dd>{bostotteSak.ar}</dd>
                <dt>Måned</dt>
                <dd>{bostotteSak.mnd}</dd>
                <dt>Status</dt>
                <dd>{getBostotteStatusLabel(bostotteSak.status)}</dd>
                {bostotteSak.status === BostotteStatus.VEDTATT && (
                    <>
                        <dt>Ident</dt>
                        <dd>{bostotteSak.vedtak?.beskrivelse}</dd>
                    </>
                )}
                <dt>Rolle</dt>
                <dd>{getBostotteRolleLabel(bostotteSak.rolle)}</dd>
            </DefinitionList>
        </StyledPanel>
    );
};
