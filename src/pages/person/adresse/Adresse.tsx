import * as React from 'react';
import { useEffect, useRef } from 'react';
import { AdresseAction, AdresseState } from './useAdresse';
import { TextField } from '@navikt/ds-react';

const Adresse = ({
    dispatch,
    lockedMode,
    state: { adressenavn, husbokstav, husnummer, kommunenummer, postnummer, validHusnummer },
}: {
    lockedMode?: boolean;
    state: AdresseState;
    dispatch: React.Dispatch<AdresseAction>;
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!validHusnummer) inputRef?.current?.focus();
    }, [validHusnummer]);

    const onHusnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!validHusnummer) dispatch({ type: 'validHusnummer', value: true });
        dispatch({ type: 'husnummer', value: e.target.value });
    };

    return (
        <>
            <TextField
                label="Gateadresse"
                disabled={lockedMode}
                value={adressenavn}
                onChange={(e) => dispatch({ type: 'adressenavn', value: e.target.value })}
            />
            <div className={'flex gap-2 [&_.navds-form-field]:flex-1'}>
                <TextField
                    label="Husnummer"
                    disabled={lockedMode}
                    value={husnummer}
                    ref={inputRef}
                    error={validHusnummer ? null : 'Husnummer må være et heltall'}
                    onChange={onHusnummerChange}
                />
                <TextField
                    label="Husbokstav"
                    disabled={lockedMode}
                    value={husbokstav}
                    onChange={(e) => dispatch({ type: 'husbokstav', value: e.target.value })}
                />
                <TextField
                    label="Postnummer"
                    disabled={lockedMode}
                    value={postnummer}
                    onChange={(e) => dispatch({ type: 'postnummer', value: e.target.value })}
                />
                <TextField
                    label="Kommunenummer"
                    className="kommunenr"
                    disabled={lockedMode}
                    value={kommunenummer}
                    onChange={(e) => dispatch({ type: 'kommunenummer', value: e.target.value })}
                />
            </div>
        </>
    );
};
export default Adresse;
