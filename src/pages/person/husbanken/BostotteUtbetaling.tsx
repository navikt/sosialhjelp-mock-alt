import React, {useState} from "react";
import {Collapse} from "react-collapse";
import {Input, Select} from "nav-frontend-skjema";
import {Knapp} from "nav-frontend-knapper";
import Panel from "nav-frontend-paneler";
import {BostotteRolle} from "./BostotteSak";

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum BostotteMottaker {
    KOMMUNE = "KOMMUNE",
    HUSSTAND = "HUSSTAND",
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

function getIsoDateString(date: Date) {
    return date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" + (date.getDate() < 9 ? "0" : "") + (date.getDate() + 1);
}

export const NyttBostotteUtbetaling = ({isOpen, callback}: Params) => {
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
        event.preventDefault()
    }
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault()
    }

    return (
        <Collapse isOpened={isOpen}>
            <Panel border={true}>
                <Input label="Beløp"
                       value={belop}
                       onChange={(evt: any) => setBelop(evt.target.value)}
                />
                <Input label="Utbetalingsdato"
                       value={utbetalingsdato}
                       onChange={(evt: any) => setUtbetalingsdato(evt.target.value)}
                />
                <Select label="Mottaker"
                        onChange={(evt: any) => setMottaker(evt.target.value)}
                        value={mottaker}
                >
                    <option value={BostotteMottaker.HUSSTAND}>Husstand</option>
                    <option value={BostotteMottaker.KOMMUNE}>Kommunen</option>
                </Select>
                <Select label="Rolle"
                        onChange={(evt: any) => setRolle(evt.target.value)}
                        value={rolle}
                >
                    <option value={BostotteRolle.HOVEDPERSON}>Hovedperson</option>
                    <option value={BostotteRolle.BIPERSON}>Biperson</option>
                </Select>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}
                >
                    Legg til
                </Knapp>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                    className="leftPadding"
                >
                    Cancel
                </Knapp>
            </Panel>
        </Collapse>
    );
}

interface ViseParams {
    bostotteUtbetaling: BostotteUtbetalingObject;
}

export const VisBostotteUtbetaling = ({bostotteUtbetaling}: ViseParams) => {
    return (<Panel border={true}>
            <div>Beløp: {bostotteUtbetaling.belop}</div>
            <div>Utbetalingsdato: {bostotteUtbetaling.utbetalingsdato}</div>
            <div>Mottaker: {bostotteUtbetaling.mottaker}</div>
            <div>Rolle: {bostotteUtbetaling.rolle}</div>
        </Panel>
    );
}
