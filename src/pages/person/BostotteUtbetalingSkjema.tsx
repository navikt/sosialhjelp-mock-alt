import { UtbetalingerDto } from '../../generated/model';
import { VisBostotteUtbetaling } from './husbanken/VisBostotteUtbetaling';
import { NyttBostotteUtbetaling } from './husbanken/BostotteUtbetaling';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';

export const BostotteUtbetalingSkjema = ({
    bostotteUtbetalinger,
    onChange,
    lockedMode,
}: {
    bostotteUtbetalinger: UtbetalingerDto[];
    onChange: (bostotteUtbetalinger: UtbetalingerDto[]) => void;
    lockedMode: boolean;
}) => {
    const [leggTilBostotteUtbetaling, setLeggTilBostotteUtbetaling] = useState<boolean>(false);

    return (
        <>
            {bostotteUtbetalinger.map((utbetaling: UtbetalingerDto, index: number) => (
                <VisBostotteUtbetaling
                    bostotteUtbetaling={utbetaling}
                    key={'bostotteUtbetaling_' + index}
                    onSlett={() => onChange(bostotteUtbetalinger.filter((item) => item !== utbetaling))}
                />
            ))}
            <NyttBostotteUtbetaling
                isOpen={leggTilBostotteUtbetaling}
                callback={(nyBostotteUtbetaling) => {
                    if (nyBostotteUtbetaling) {
                        bostotteUtbetalinger.push(nyBostotteUtbetaling);
                        onChange(bostotteUtbetalinger);
                    }
                    setLeggTilBostotteUtbetaling(false);
                }}
            />
            {!lockedMode && !leggTilBostotteUtbetaling && (
                <Button variant="secondary" onClick={() => setLeggTilBostotteUtbetaling(true)}>
                    Legg til utbetaling
                </Button>
            )}
        </>
    );
};
