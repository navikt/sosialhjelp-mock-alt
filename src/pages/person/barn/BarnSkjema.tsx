import { Button, Label } from '@navikt/ds-react';
import { VisBarn } from './VisBarn';
import { NyttBarn } from './Barn';
import { FrontendBarn } from '../../../generated/model';
import React from 'react';

export const BarnSkjema = ({
    barn,
    setBarn,
    lockedMode,
}: {
    barn: FrontendBarn[];
    setBarn: (barn: FrontendBarn[]) => void;
    lockedMode: boolean;
}) => {
    const [visNyttBarnSkjema, setVisNyttBarnSkjema] = React.useState(false);
    return (
        <div>
            <Label as="p" spacing>
                Barn
            </Label>
            {barn.map((obj, index) => (
                <VisBarn
                    barn={obj}
                    key={`barn_${index}`}
                    onSlett={() => setBarn(barn.filter((item) => item !== obj))}
                />
            ))}
            {visNyttBarnSkjema && (
                <NyttBarn
                    isOpen={visNyttBarnSkjema}
                    onSave={(nyttTilBarn) => {
                        setBarn([...barn, nyttTilBarn]);
                        setVisNyttBarnSkjema(false);
                    }}
                    onCancel={() => setVisNyttBarnSkjema(false)}
                />
            )}
            {!lockedMode && !visNyttBarnSkjema && (
                <Button variant="secondary" onClick={() => setVisNyttBarnSkjema(true)}>
                    Legg til barn
                </Button>
            )}
        </div>
    );
};
