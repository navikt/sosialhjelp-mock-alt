import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button, Fieldset } from '@navikt/ds-react';
import {
    AvbrytKnapp,
    DefinitionList,
    Knappegruppe,
    StyledInput,
    StyledPanel,
    StyledSelect,
} from '../../../styling/Styles';
import SletteKnapp from '../../../components/SletteKnapp';

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

const getSkatteutbetalingLabel = (key: SkatteutbetalingType) => {
    switch (key) {
        case 'Loennsinntekt':
            return 'Lønnsinntekt';
        case 'YtelseFraOffentlige':
            return 'Ytelse fra det offentlige';
        case 'PensjonEllerTrygd':
            return 'Pensjon eller trygd';
        case 'LottOgPartInnenFiske':
            return 'Lott og part innen fiske';
        case 'DagmammaIEgenBolig':
            return 'Dagmamma i egen bolig';
        case 'Naeringsinntekt':
            return 'Næringsinntekt';
        case 'AldersUfoereEtterlatteAvtalefestetOgKrigspensjon':
            return 'Alder, uføre, etterlatte, avtalefestet og krigspensjon';
        default:
            return '';
    }
};

export interface SkatteutbetalingObject {
    beloep: string;
    trekk: string;
    orgnummer: string;
    maned: string;
    type: SkatteutbetalingType;
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
    const [orgnummer, setOrgnummer] = useState('123456785');
    const [maned, setManed] = useState<string>(getMonthDateString(month_1));
    const [type, setType] = useState<SkatteutbetalingType>(SkatteutbetalingType.LOENNSINNTEKT);

    const onLagre = (event: ClickEvent) => {
        const nyttSkatteutbetalingObject: SkatteutbetalingObject = {
            beloep: belop,
            trekk: trekk,
            orgnummer: orgnummer,
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
                <Fieldset legend="Legg til utbetaling (Data fra Skatteetaten)">
                    <StyledInput label="Beløp" value={belop} onChange={(evt: any) => setBelop(evt.target.value)} />
                    <StyledInput label="Trekk" value={trekk} onChange={(evt: any) => setTrekk(evt.target.value)} />
                    <StyledInput
                        label="Orgnummer"
                        type="number"
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
                        {Object.values(SkatteutbetalingType).map((value: SkatteutbetalingType): JSX.Element => {
                            return (
                                <option key={value} value={value}>
                                    {getSkatteutbetalingLabel(value)}
                                </option>
                            );
                        })}
                    </StyledSelect>
                </Fieldset>
                <Knappegruppe>
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Button>
                    <AvbrytKnapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}>
                        Avbryt
                    </AvbrytKnapp>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};

interface ViseParams {
    skatteutbetaling: SkatteutbetalingObject;
    onSlett: () => void;
}

export const VisSkatteutbetaling = ({ skatteutbetaling, onSlett }: ViseParams) => {
    return (
        <StyledPanel>
            <DefinitionList>
                <dt>Beløp</dt>
                <dd>{skatteutbetaling.beloep}</dd>
                <dt>Trekk</dt>
                <dd>{skatteutbetaling.trekk}</dd>
                <dt>Orgnummer</dt>
                <dd>{skatteutbetaling.orgnummer}</dd>
                <dt>Måned</dt>
                <dd>{skatteutbetaling.maned}</dd>
                <dt>Type</dt>
                <dd>{getSkatteutbetalingLabel(skatteutbetaling.type)}</dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
