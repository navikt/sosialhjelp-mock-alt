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
import { getVedtakstype, VedtakKodeType, Vedtakskode } from './vedtak';
import SletteKnapp from '../../../components/SletteKnapp';

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

export interface BostotteSakObject {
    mnd: number;
    ar: number;
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

export const NyBostotteSak = ({ isOpen, callback }: Params) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [ar, setAr] = useState<number>(sistManed.getFullYear());
    const [mnd, setMnd] = useState<number>(sistManed.getMonth() + 1);
    const [status, setStatus] = useState<BostotteStatus>(BostotteStatus.UNDER_BEHANDLING);
    const [rolle, setRolle] = useState<BostotteRolle>(BostotteRolle.HOVEDPERSON);
    const [vedtaksKode, setVedtaksKode] = useState<VedtakKodeType>('V00');

    const onLagre = (event: ClickEvent) => {
        if (status === BostotteStatus.VEDTATT) {
            const kode = vedtaksKode;
            const beskrivelse = Vedtakskode[vedtaksKode];
            const type = getVedtakstype(vedtaksKode);
            const vedtaket: VedtakObject = { kode, beskrivelse, type };
            const nyttBostotteSakObject: BostotteSakObject = {
                ar: ar,
                mnd: mnd,
                status: status,
                rolle: rolle,
                vedtak: vedtaket,
            };
            callback(nyttBostotteSakObject);
        } else {
            const nyttBostotteSakObject: BostotteSakObject = {
                ar: ar,
                mnd: mnd,
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
                        {Object.entries(Vedtakskode).map(
                            ([key, label]): JSX.Element => {
                                return (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                );
                            }
                        )}
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
    onSlett: () => void;
}

export const VisBostotteSak = ({ bostotteSak, onSlett }: ViseParams) => {
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
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
