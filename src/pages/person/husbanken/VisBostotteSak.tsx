import { SakerDto, SakerDtoStatus } from '../../../generated/model';
import { DefinitionList, StyledPanel } from '../../../styling/Styles';
import SletteKnapp from '../../../components/SletteKnapp';
import React from 'react';

import { rolleLabel, statusLabel } from './labels';

export const VisBostotteSak = ({ bostotteSak, onSlett }: { bostotteSak: SakerDto; onSlett: () => void }) => (
    <StyledPanel>
        <DefinitionList>
            <dt>År</dt>
            <dd>{bostotteSak.ar}</dd>
            <dt>Måned</dt>
            <dd>{bostotteSak.mnd}</dd>
            <dt>Status</dt>
            <dd>{statusLabel[bostotteSak.status]}</dd>
            {bostotteSak.status === SakerDtoStatus.VEDTATT && (
                <>
                    <dt>Ident</dt>
                    <dd>{bostotteSak.vedtak?.beskrivelse}</dd>
                </>
            )}
            <dt>Rolle</dt>
            <dd>{rolleLabel[bostotteSak.rolle]}</dd>
        </DefinitionList>
        <SletteKnapp onClick={onSlett} />
    </StyledPanel>
);
