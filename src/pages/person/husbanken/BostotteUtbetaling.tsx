import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knapp } from 'nav-frontend-knapper';
import { BostotteRolle } from './BostotteSak';
import { Knappegruppe, StyledInput, StyledPanel, StyledSelect } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum BostotteMottaker {
    KOMMUNE = 'KOMMUNE',
    HUSSTAND = 'HUSSTAND',
}

export interface BostotteUtbetalingObject {
    belop: string;
    utbetalingsdato: string;
    mottaker: string;
    rolle: string;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

export const NyttBostotteUtbetaling = ({ isOpen, callback }: Params) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [belop, setBelop] = useState<number>(1337);
    const [utbetalingsdato, setUtbetalingsdato] = useState<string>(getIsoDateString(sistManed));
    const [mottaker, setMottaker] = useState<BostotteMottaker>(BostotteMottaker.HUSSTAND);
    const [rolle, setRolle] = useState<BostotteRolle>(BostotteRolle.HOVEDPERSON);

    const onLagre = (event: ClickEvent) => {
        const nyttBostotteUtbetalingObject: BostotteUtbetalingObject = {
            belop: belop.toString(),
            utbetalingsdato: utbetalingsdato,
            mottaker: mottaker,
            rolle: rolle,
        };

        callback(nyttBostotteUtbetalingObject);
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <StyledPanel>
                <StyledInput label="Beløp" value={belop} onChange={(evt: any) => setBelop(evt.target.value)} />
                <StyledInput
                    label="Utbetalingsdato (åååå-mm-dd)"
                    value={utbetalingsdato}
                    onChange={(evt: any) => setUtbetalingsdato(evt.target.value)}
                />
                <StyledSelect label="Mottaker" onChange={(evt: any) => setMottaker(evt.target.value)} value={mottaker}>
                    <option value={BostotteMottaker.HUSSTAND}>Husstand</option>
                    <option value={BostotteMottaker.KOMMUNE}>Kommunen</option>
                </StyledSelect>
                <StyledSelect label="Rolle" onChange={(evt: any) => setRolle(evt.target.value)} value={rolle}>
                    <option value={BostotteRolle.HOVEDPERSON}>Hovedperson</option>
                    <option value={BostotteRolle.BIPERSON}>Biperson</option>
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
    bostotteUtbetaling: BostotteUtbetalingObject;
}

export const VisBostotteUtbetaling = ({ bostotteUtbetaling }: ViseParams) => {
    return (
        <StyledPanel>
            <div>Beløp: {bostotteUtbetaling.belop}</div>
            <div>Utbetalingsdato: {bostotteUtbetaling.utbetalingsdato}</div>
            <div>Mottaker: {bostotteUtbetaling.mottaker}</div>
            <div>Rolle: {bostotteUtbetaling.rolle}</div>
        </StyledPanel>
    );
};
