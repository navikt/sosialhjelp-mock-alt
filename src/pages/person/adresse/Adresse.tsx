import * as React from 'react';
import styled from 'styled-components';
import { AdresseAction, AdresseState } from './useAdresse';
import { useEffect, useRef } from 'react';
import { Fieldset, TextField, Heading } from '@navikt/ds-react';

const AdresseBokser = styled.div`
    display: flex;
    flex-wrap: wrap;

    column-gap: 1rem;

    .navds-form-field {
        flex: 1;
    }
`;

interface Props {
    lockedMode?: boolean;
    state: AdresseState;
    dispatch: React.Dispatch<AdresseAction>;
}

const Adresse = (props: Props) => {
    const { lockedMode, state, dispatch } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!state.validHusnummer) {
            inputRef?.current?.focus();
        }
    }, [state.validHusnummer]);

    const onHusnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!state.validHusnummer) {
            dispatch({ type: 'validHusnummer', value: true });
        }
        dispatch({ type: 'husnummer', value: e.target.value });
    };
    return (
        <Fieldset
            legend={
                <Heading level="2" size="medium">
                    Bostedsadresse
                </Heading>
            }
        >
            <TextField
                label="Gateadresse"
                disabled={!!lockedMode}
                value={state.adressenavn}
                onChange={(e) => dispatch({ type: 'adressenavn', value: e.target.value })}
            />
            <AdresseBokser>
                <TextField
                    label="Husnummer"
                    disabled={!!lockedMode}
                    value={state.husnummer}
                    ref={(ref) => {
                        inputRef.current = ref;
                    }}
                    error={state.validHusnummer ? null : 'Husnummer må være et heltall'}
                    onChange={onHusnummerChange}
                />
                <TextField
                    label="Husbokstav"
                    disabled={!!lockedMode}
                    value={state.husbokstav}
                    onChange={(e) => dispatch({ type: 'husbokstav', value: e.target.value })}
                />
                <TextField
                    label="Postnummer"
                    disabled={!!lockedMode}
                    value={state.postnummer}
                    onChange={(e) => dispatch({ type: 'postnummer', value: e.target.value })}
                />
                <TextField
                    label="Kommunenummer"
                    className="kommunenr"
                    disabled={!!lockedMode}
                    value={state.kommunenummer}
                    onChange={(e) => dispatch({ type: 'kommunenummer', value: e.target.value })}
                />
            </AdresseBokser>
        </Fieldset>
    );
};
export default Adresse;
