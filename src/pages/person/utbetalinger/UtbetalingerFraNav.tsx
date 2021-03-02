import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knapp } from 'nav-frontend-knapper';
import { DefinitionList, Knappegruppe, StyledInput, StyledPanel } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface UtbetalingFraNavObject {
    belop: string;
    dato: string;
    ytelsestype: string;
    melding: string;
    skattebelop: string;
    ytelseskomponenttype: string;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
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
        const nyttUtbetalingerFraNavObject: UtbetalingFraNavObject = {
            belop: belop,
            dato: dato,
            ytelsestype: ytelsestype,
            melding: 'melding',
            skattebelop: skattebelop,
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
                <StyledInput label="Beløp" value={belop} onChange={(evt: any) => setBelop(evt.target.value)} />
                <StyledInput
                    label="Utbetalingsdato (åååå-mm-dd)"
                    value={dato}
                    onChange={(evt: any) => setDato(evt.target.value)}
                />
                <StyledInput
                    label="Ytelsestype"
                    value={ytelsestype}
                    onChange={(evt: any) => setYtelsestype(evt.target.value)}
                />
                <StyledInput
                    label="Skattebeløp"
                    value={skattebelop}
                    onChange={(evt: any) => setSkattebelop(evt.target.value)}
                />
                <StyledInput
                    label="Ytelseskomponenttype"
                    value={ytelseskomponenttype}
                    onChange={(evt: any) => setYtelseskomponenttype(evt.target.value)}
                />
                <Knappegruppe>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Knapp>
                    <Knapp
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                        className="leftPadding"
                    >
                        Avbryt
                    </Knapp>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};

interface ViseParams {
    utbetalingFraNav: UtbetalingFraNavObject;
}

export const VisUtbetalingerFraNav = ({ utbetalingFraNav }: ViseParams) => {
    return (
        <StyledPanel>
            <DefinitionList labelWidth={10.5}>
                <dt>Beløp</dt>
                <dd>{utbetalingFraNav.belop}</dd>
                <dt>Utbetalingsdato</dt>
                <dd>{utbetalingFraNav.dato}</dd>
                <dt>Ytelsestype</dt>
                <dd>{utbetalingFraNav.ytelsestype}</dd>
                <dt>Skattebeløp</dt>
                <dd>{utbetalingFraNav.skattebelop}</dd>
                <dt>Ytelseskomponenttype</dt>
                <dd>{utbetalingFraNav.ytelseskomponenttype}</dd>
            </DefinitionList>
        </StyledPanel>
    );
};
