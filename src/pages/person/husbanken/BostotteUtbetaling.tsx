import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button } from '@navikt/ds-react';
import { BostotteRolle, getBostotteRolleLabel } from './BostotteSak';
import {
    AvbrytKnapp,
    DefinitionList,
    Knappegruppe,
    StyledInput,
    StyledPanel,
    StyledSelect,
    StyledFieldset,
} from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import SletteKnapp from '../../../components/SletteKnapp';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum BostotteMottaker {
    KOMMUNE = 'KOMMUNE',
    HUSSTAND = 'HUSSTAND',
}

const getBostotteMottakerLabel = (key: BostotteMottaker) => {
    switch (key) {
        case 'KOMMUNE':
            return 'Kommunen';
        case 'HUSSTAND':
            return 'Husstand';
        default:
            return '';
    }
};

export interface BostotteUtbetalingObject {
    belop: string;
    utbetalingsdato: string;
    mottaker: BostotteMottaker;
    rolle: BostotteRolle;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

export const NyttBostotteUtbetaling = ({ isOpen, callback }: Params) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [belop, setBelop] = useState('1337');
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
                <StyledFieldset legend="Legg til utbetaling fra Husbanken">
                    <StyledInput
                        label="Beløp"
                        type="number"
                        value={belop}
                        onChange={(evt: any) => setBelop(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledInput
                        label="Utbetalingsdato (åååå-mm-dd)"
                        value={utbetalingsdato}
                        onChange={(evt: any) => setUtbetalingsdato(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledSelect
                        label="Mottaker"
                        onChange={(evt: any) => setMottaker(evt.target.value)}
                        value={mottaker}
                    >
                        <option value={BostotteMottaker.HUSSTAND}>
                            {getBostotteMottakerLabel(BostotteMottaker.HUSSTAND)}
                        </option>
                        <option value={BostotteMottaker.KOMMUNE}>
                            {getBostotteMottakerLabel(BostotteMottaker.KOMMUNE)}
                        </option>
                    </StyledSelect>
                    <StyledSelect label="Rolle" onChange={(evt: any) => setRolle(evt.target.value)} value={rolle}>
                        <option value={BostotteRolle.HOVEDPERSON}>
                            {getBostotteRolleLabel(BostotteRolle.HOVEDPERSON)}
                        </option>
                        <option value={BostotteRolle.BIPERSON}>{getBostotteRolleLabel(BostotteRolle.BIPERSON)}</option>
                    </StyledSelect>
                </StyledFieldset>
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
    bostotteUtbetaling: BostotteUtbetalingObject;
    onSlett: () => void;
}

export const VisBostotteUtbetaling = ({ bostotteUtbetaling, onSlett }: ViseParams) => {
    return (
        <StyledPanel>
            <DefinitionList>
                <dt>Beløp</dt>
                <dd>{bostotteUtbetaling.belop}</dd>
                <dt>Utbetalingsdato </dt>
                <dd>{bostotteUtbetaling.utbetalingsdato}</dd>
                <dt>Mottaker </dt>
                <dd>{getBostotteMottakerLabel(bostotteUtbetaling.mottaker)}</dd>
                <dt>Rolle </dt>
                <dd>{getBostotteRolleLabel(bostotteUtbetaling.rolle)}</dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
