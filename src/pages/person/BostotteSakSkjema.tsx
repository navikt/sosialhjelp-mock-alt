import { SakerDto } from '../../generated/model';
import { VisBostotteSak } from './husbanken/VisBostotteSak';
import { NyBostotteSak } from './husbanken/BostotteSak';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';

export const BostotteSakSkjema = ({
    bostotteSaker,
    onChange,
    lockedMode,
}: {
    bostotteSaker: SakerDto[];
    onChange: (bostotteSaker: SakerDto[]) => void;
    lockedMode: boolean;
}) => {
    const [leggTilBostotteSak, setLeggTilBostotteSak] = useState<boolean>(false);

    return (
        <>
            {bostotteSaker.map((sak, index) => (
                <VisBostotteSak
                    bostotteSak={sak}
                    key={'bostotteSak_' + index}
                    onSlett={() => onChange(bostotteSaker.filter((item) => item !== sak))}
                />
            ))}
            <NyBostotteSak
                isOpen={leggTilBostotteSak}
                callback={(nyBostotteSak) => {
                    if (nyBostotteSak) onChange([...bostotteSaker, nyBostotteSak]);
                    setLeggTilBostotteSak(false);
                }}
            />
            {!lockedMode && !leggTilBostotteSak && (
                <Button variant="secondary" className="leggTilBostotte" onClick={() => setLeggTilBostotteSak(true)}>
                    Legg til sak
                </Button>
            )}
        </>
    );
};
