import { NyttSkatteutbetaling, VisSkatteutbetaling } from './skattetaten/Skattetaten';
import { Button, Fieldset } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FrontendSkattbarInntekt } from '../../generated/model';

export const SkatteutbetalingerSkjema = ({
    skattetatenUtbetalinger,
    onChange,
    lockedMode,
}: {
    skattetatenUtbetalinger: FrontendSkattbarInntekt[];
    onChange: (skattutbetalinger: FrontendSkattbarInntekt[]) => void;
    lockedMode: boolean;
}) => {
    const [leggTilSkatt, setLeggTilSkatt] = useState<boolean>(false);

    return (
        <Fieldset legend="Skattetaten">
            {skattetatenUtbetalinger.map((utbetaling, index) => (
                <VisSkatteutbetaling
                    skatteutbetaling={utbetaling}
                    key={'skatt_' + index}
                    onSlett={() => onChange(skattetatenUtbetalinger.filter((item) => item !== utbetaling))}
                />
            ))}
            <NyttSkatteutbetaling
                isOpen={leggTilSkatt}
                callback={(nyUtbetaling) => {
                    if (nyUtbetaling) onChange([...skattetatenUtbetalinger, nyUtbetaling]);
                    setLeggTilSkatt(false);
                }}
            />
            {!lockedMode && !leggTilSkatt && (
                <Button variant="secondary" onClick={() => setLeggTilSkatt(true)}>
                    Legg til utbetaling
                </Button>
            )}
        </Fieldset>
    );
};
