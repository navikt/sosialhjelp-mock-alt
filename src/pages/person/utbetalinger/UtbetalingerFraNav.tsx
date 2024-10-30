import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button } from '@navikt/ds-react';
import {
    AvbrytKnapp,
    DefinitionList,
    Knappegruppe,
    StyledFieldset,
    StyledInput,
    StyledPanel,
} from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import SletteKnapp from '../../../components/SletteKnapp';
import { FrontendUtbetalingFraNav } from '../../../generated/model';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Params {
    isOpen: boolean;
    callback: (data: FrontendUtbetalingFraNav | null) => void;
}

export const NyttUtbetalingerFraNav = ({ isOpen, callback }: Params) => {
    let dato1 = new Date();
    dato1.setMonth(dato1.getMonth() - 1);

    const [belop, setBelop] = useState<string>('10000');
    const [dato, setDato] = useState<string>(getIsoDateString(dato1));
    const [ytelsestype, setYtelsestype] = useState<string>('Dagpenger');
    const [skattebelop, setSkattebelop] = useState<string>('0');
    const [ytelseskomponenttype, setYtelseskomponenttype] = useState<string>('');

    const onLagre = (event: ClickEvent) => {
        const nyttUtbetalingerFraNavObject: FrontendUtbetalingFraNav = {
            belop: parseInt(belop),
            dato: dato,
            ytelsestype: ytelsestype,
            skattebelop: parseInt(skattebelop),
            ytelseskomponenttype: ytelseskomponenttype,
        };

        callback(nyttUtbetalingerFraNavObject);
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <StyledPanel>
                <StyledFieldset legend="Legg til utbetaling fra Nav">
                    <StyledInput
                        label="Beløp"
                        value={belop}
                        onChange={(evt) => setBelop(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledInput
                        label="Utbetalingsdato (åååå-mm-dd)"
                        value={dato}
                        onChange={(evt) => setDato(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledInput
                        label="Ytelsestype"
                        value={ytelsestype}
                        onChange={(evt) => setYtelsestype(evt.target.value)}
                        htmlSize={30}
                    />
                    <StyledInput
                        label="Skattebeløp"
                        value={skattebelop}
                        onChange={(evt) => setSkattebelop(evt.target.value)}
                        htmlSize={20}
                    />
                    <StyledInput
                        label="Ytelseskomponenttype"
                        value={ytelseskomponenttype}
                        onChange={(evt) => setYtelseskomponenttype(evt.target.value)}
                    />
                </StyledFieldset>
                <Knappegruppe>
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Button>
                    <AvbrytKnapp
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                        className="leftPadding"
                    >
                        Avbryt
                    </AvbrytKnapp>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};

export const VisUtbetalingerFraNav = ({
    utbetalingFraNav: { belop, dato, skattebelop, ytelseskomponenttype, ytelsestype },
    onSlett,
}: {
    utbetalingFraNav: FrontendUtbetalingFraNav;
    onSlett: () => void;
}) => {
    return (
        <StyledPanel>
            <DefinitionList labelWidth={30}>
                <dt>Beløp</dt>
                <dd>{belop}</dd>
                <dt>Utbetalingsdato</dt>
                <dd>{dato}</dd>
                <dt>Ytelsestype</dt>
                <dd>{ytelsestype}</dd>
                <dt>Skattebeløp</dt>
                <dd>{skattebelop}</dd>
                <dt>Ytelseskomponenttype</dt>
                <dd>{ytelseskomponenttype}</dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
