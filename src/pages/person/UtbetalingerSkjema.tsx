import { Button, Fieldset } from '@navikt/ds-react';
import { NyttUtbetalingerFraNav, VisUtbetalingerFraNav } from './utbetalinger/UtbetalingerFraNav';
import { FrontendUtbetalingFraNav } from '../../generated/model';
import React, { useState } from 'react';

export const UtbetalingerSkjema = ({
    utbetalingerFraNav,
    onChange,
    lockedMode,
}: {
    utbetalingerFraNav: FrontendUtbetalingFraNav[];
    onChange: (utbetalingerFraNav: FrontendUtbetalingFraNav[]) => void;
    lockedMode: boolean;
}) => {
    const [leggTilUtbetalingFraNav, setLeggTilUtbetalingFraNav] = useState<boolean>(false);

    return (
        <Fieldset legend="Nav utbetalinger">
            {utbetalingerFraNav.map((utbetaling, index) => (
                <VisUtbetalingerFraNav
                    utbetalingFraNav={utbetaling}
                    key={'utbetalingFraNav_' + index}
                    onSlett={() => onChange(utbetalingerFraNav.filter((item) => item !== utbetaling))}
                />
            ))}
            <NyttUtbetalingerFraNav
                isOpen={leggTilUtbetalingFraNav}
                callback={(nyUtbetaling: FrontendUtbetalingFraNav) => {
                    if (nyUtbetaling) {
                        utbetalingerFraNav.push(nyUtbetaling);
                        onChange(utbetalingerFraNav);
                    }
                    setLeggTilUtbetalingFraNav(false);
                }}
            />
            {!lockedMode && !leggTilUtbetalingFraNav && (
                <Button variant="secondary" onClick={() => setLeggTilUtbetalingFraNav(true)}>
                    Legg til utbetaling
                </Button>
            )}
        </Fieldset>
    );
};
