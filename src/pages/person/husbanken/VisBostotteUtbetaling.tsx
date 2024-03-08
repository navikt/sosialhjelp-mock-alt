import { UtbetalingerDto } from '../../../generated/model';
import { DefinitionList, StyledPanel } from '../../../styling/Styles';
import SletteKnapp from '../../../components/SletteKnapp';
import React from 'react';

import { mottakerLabel, rolleLabel } from './labels';

export const VisBostotteUtbetaling = ({
    bostotteUtbetaling,
    onSlett,
}: {
    bostotteUtbetaling: UtbetalingerDto;
    onSlett: () => void;
}) => {
    return (
        <StyledPanel>
            <DefinitionList>
                <dt>Beløp</dt>
                <dd>{bostotteUtbetaling.belop}</dd>
                <dt>Utbetalingsdato</dt>
                <dd>{bostotteUtbetaling.utbetalingsdato}</dd>
                <dt>Mottaker</dt>
                <dd>{mottakerLabel[bostotteUtbetaling.mottaker]}</dd>
                <dt>Rolle</dt>
                <dd>{rolleLabel[bostotteUtbetaling.rolle]}</dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
