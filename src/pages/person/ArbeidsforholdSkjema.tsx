import { Button } from '@navikt/ds-react';
import { NyttArbeidsforhold, VisArbeidsforhold } from './arbeidsforhold/Arbeidsfohold';
import React, { useState } from 'react';
import { ArbeidsforholdObject } from './arbeidsforhold/types';

export const ArbeidsforholdSkjema = ({
    arbeidsforhold,
    onChange,
    lockedMode,
}: {
    arbeidsforhold: ArbeidsforholdObject[];
    onChange: (arbeidsforhold: ArbeidsforholdObject[]) => void;
    lockedMode: boolean;
}) => {
    const [leggTilArbeidsforhold, setLeggTilArbeidsforhold] = useState<boolean>(false);

    return (
        <>
            {arbeidsforhold.map((forhold, index) => (
                <VisArbeidsforhold
                    arbeidsforhold={forhold}
                    key={'arbeid_' + index}
                    onSlett={() => onChange(arbeidsforhold.filter((item) => item !== forhold))}
                />
            ))}
            <NyttArbeidsforhold
                isOpen={leggTilArbeidsforhold}
                callback={(nyttTilArbeidsforhold) => {
                    if (nyttTilArbeidsforhold) {
                        onChange([...arbeidsforhold, nyttTilArbeidsforhold]);
                    }
                    setLeggTilArbeidsforhold(false);
                }}
            />
            {!lockedMode && !leggTilArbeidsforhold && (
                <Button variant="secondary" onClick={() => setLeggTilArbeidsforhold(true)}>
                    Legg til arbeidsforhold
                </Button>
            )}
        </>
    );
};
