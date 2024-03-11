import { PdlPersonNavn } from '../../../generated/model';
import { TextField } from '@navikt/ds-react';
import React from 'react';

export const NavnSkjema = ({ navn, onChange }: { navn: PdlPersonNavn; onChange: (navn: PdlPersonNavn) => void }) => (
    <div className={'flex gap-2 [&_.navds-form-field]:flex-1'}>
        <TextField
            label="Fornavn"
            value={navn.fornavn}
            onChange={(evt) =>
                onChange({
                    ...navn,
                    fornavn: evt.target.value,
                })
            }
        />
        <TextField
            label="Mellomnavn"
            value={navn.mellomnavn}
            onChange={(evt) =>
                onChange({
                    ...navn,
                    mellomnavn: evt.target.value,
                })
            }
        />
        <TextField
            label="Etternavn"
            value={navn.etternavn}
            onChange={(evt) =>
                onChange({
                    ...navn,
                    etternavn: evt.target.value,
                })
            }
        />
    </div>
);
