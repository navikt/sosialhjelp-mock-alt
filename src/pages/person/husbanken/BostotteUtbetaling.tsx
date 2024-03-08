import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button } from '@navikt/ds-react';
import {
    AvbrytKnapp,
    Knappegruppe,
    StyledFieldset,
    StyledInput,
    StyledPanel,
    StyledSelect,
} from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import { SakerDtoRolle, UtbetalingerDto, UtbetalingerDtoMottaker } from '../../../generated/model';
import { mottakerLabel, rolleLabel } from './labels';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const { HUSSTAND, KOMMUNE } = UtbetalingerDtoMottaker;
const { HOVEDPERSON, BIPERSON } = SakerDtoRolle;

export const NyttBostotteUtbetaling = ({ isOpen, callback }: { isOpen: boolean; callback: (data: any) => void }) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [belop, setBelop] = useState(1337);
    const [utbetalingsdato, setUtbetalingsdato] = useState<string>(getIsoDateString(sistManed));

    const [mottaker, setMottaker] = useState<UtbetalingerDtoMottaker>(HUSSTAND);
    const [rolle, setRolle] = useState<SakerDtoRolle>(HOVEDPERSON);

    const onLagre = (event: ClickEvent) => {
        const nyttBostotteUtbetalingObject: UtbetalingerDto = { belop, utbetalingsdato, mottaker, rolle };
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
                        onChange={(evt: any) => setBelop(parseFloat(evt.target.value))}
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
                        <option value={HUSSTAND}>{mottakerLabel[HUSSTAND]}</option>
                        <option value={KOMMUNE}>{mottakerLabel[KOMMUNE]}</option>
                    </StyledSelect>
                    <StyledSelect label="Rolle" onChange={(evt: any) => setRolle(evt.target.value)} value={rolle}>
                        <option value={HOVEDPERSON}>{rolleLabel[HOVEDPERSON]}</option>
                        <option value={BIPERSON}>{rolleLabel[BIPERSON]}</option>
                    </StyledSelect>
                </StyledFieldset>
                <Knappegruppe>
                    <Button onClick={onLagre}>Legg til</Button>
                    <AvbrytKnapp onClick={onCancel}>Avbryt</AvbrytKnapp>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};
