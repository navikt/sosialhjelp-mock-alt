import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input, Select } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { Knappegruppe, StyledInput, StyledPanel, StyledSelect } from '../../../styling/Styles';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum SkatteutbetalingType {
    LOENNSINNTEKT = 'Loennsinntekt',
    YTELSEFRAOFFENTLIGE = 'YtelseFraOffentlige',
    PENSJONELLERTRYGD = 'PensjonEllerTrygd',
    LOTTOGPARTINNENFISKE = 'LottOgPartInnenFiske',
    DAGMAMMAIEGENBOLIG = 'DagmammaIEgenBolig',
    NAERINGSINNTEKT = 'Naeringsinntekt',
    ALDERSUFOEREETTERLATTEAVTALEFESTETOGKRIGSPENSJON = 'AldersUfoereEtterlatteAvtalefestetOgKrigspensjon',
}

export interface SkatteutbetalingObject {
    beloep: string;
    trekk: string;
    orgnummer: string;
    maned: string;
    type: string;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

function getMonthDateString(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
}

export const NyttSkatteutbetaling = ({ isOpen, callback }: Params) => {
    let month_1 = new Date();
    month_1.setMonth(month_1.getMonth() - 1);
    let month_2 = new Date();
    month_2.setMonth(month_2.getMonth() - 2);
    let month_3 = new Date();
    month_3.setMonth(month_3.getMonth() - 3);
    let month_4 = new Date();
    month_4.setMonth(month_4.getMonth() - 4);

    const [belop, setBelop] = useState<string>('10000');
    const [trekk, setTrekk] = useState<string>('3333');
    const [orgnummer, setOrgnummer] = useState<number>(123456785);
    const [maned, setManed] = useState<string>(getMonthDateString(month_1));
    const [type, setType] = useState<string>(SkatteutbetalingType.LOENNSINNTEKT);

    const onLagre = (event: ClickEvent) => {
        const nyttSkatteutbetalingObject: SkatteutbetalingObject = {
            beloep: belop,
            trekk: trekk,
            orgnummer: orgnummer.toString(),
            maned: maned,
            type: type,
        };

        callback(nyttSkatteutbetalingObject);
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
                <StyledInput label="Trekk" value={trekk} onChange={(evt: any) => setTrekk(evt.target.value)} />
                <StyledInput
                    label="Orgnummer"
                    value={orgnummer}
                    onChange={(evt: any) => setOrgnummer(evt.target.value)}
                />
                <StyledSelect label="Måned" onChange={(evt: any) => setManed(evt.target.value)} value={maned}>
                    <option value={getMonthDateString(month_1)}>{getMonthDateString(month_1)}</option>
                    <option value={getMonthDateString(month_2)}>{getMonthDateString(month_2)}</option>
                    <option value={getMonthDateString(month_3)}>{getMonthDateString(month_3)}</option>
                    <option value={getMonthDateString(month_4)}>{getMonthDateString(month_4)}</option>
                </StyledSelect>
                <StyledSelect
                    label="Velg arbeidsgivertype"
                    onChange={(evt: any) => setType(evt.target.value)}
                    value={type}
                >
                    <option value={SkatteutbetalingType.LOENNSINNTEKT}>Lønnsinntekt</option>
                    <option value={SkatteutbetalingType.YTELSEFRAOFFENTLIGE}>Ytelse fra det offentliger</option>
                    <option value={SkatteutbetalingType.PENSJONELLERTRYGD}>Pensjon eller trygd</option>
                    <option value={SkatteutbetalingType.LOTTOGPARTINNENFISKE}>Lott og part innen fiske</option>
                    <option value={SkatteutbetalingType.DAGMAMMAIEGENBOLIG}>Dagmamma i egen bolig</option>
                    <option value={SkatteutbetalingType.NAERINGSINNTEKT}>Næringsinntekt</option>
                    <option value={SkatteutbetalingType.ALDERSUFOEREETTERLATTEAVTALEFESTETOGKRIGSPENSJON}>
                        Alder, uføre, etterlatte, avtalefestet og krigspensjon
                    </option>
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
    skatteutbetaling: SkatteutbetalingObject;
}

export const VisSkatteutbetaling = ({ skatteutbetaling }: ViseParams) => {
    return (
        <StyledPanel>
            <div>Beløp: {skatteutbetaling.beloep}</div>
            <div>Trekk: {skatteutbetaling.trekk}</div>
            <div>Orgnummer: {skatteutbetaling.orgnummer}</div>
            <div>Måned: {skatteutbetaling.maned}</div>
            <div>Type: {skatteutbetaling.type}</div>
        </StyledPanel>
    );
};
