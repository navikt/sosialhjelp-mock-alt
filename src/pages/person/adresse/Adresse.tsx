import * as React from 'react';
import styled from 'styled-components';
import { Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { flexWrap } from '../../../styling/Styles';
import { Undertittel } from 'nav-frontend-typografi';
import { AdresseAction, AdresseState } from './useAdresse';
import { useEffect, useRef } from 'react';

export const AdresseSkjemaGruppe = styled(SkjemaGruppe)`
    ${flexWrap};

    input {
        width: 5rem;
    }

    .gateAdresse {
        flex: 1 1 100%;
        input {
            width: 100%;
        }
    }

    .skjemaelement__feilmelding {
        width: 6rem;
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
        <AdresseSkjemaGruppe legend={<Undertittel>Bostedsadresse</Undertittel>}>
            <Input
                label="Gateadresse"
                className="gateAdresse"
                disabled={!!lockedMode}
                value={state.adressenavn}
                onChange={(e) => dispatch({ type: 'adressenavn', value: e.target.value })}
            />
            <Input
                label="Husnummer"
                disabled={!!lockedMode}
                value={state.husnummer}
                inputRef={(ref) => {
                    inputRef.current = ref;
                }}
                feil={state.validHusnummer ? null : 'Husnummer må være et heltall'}
                onChange={onHusnummerChange}
            />
            <Input
                label="Postnummer"
                disabled={!!lockedMode}
                value={state.postnummer}
                onChange={(e) => dispatch({ type: 'postnummer', value: e.target.value })}
            />
            <Input
                label="Kommunenummer"
                disabled={!!lockedMode}
                value={state.kommunenummer}
                onChange={(e) => dispatch({ type: 'kommunenummer', value: e.target.value })}
                className="kommunenr"
            />
        </AdresseSkjemaGruppe>
    );
};
export default Adresse;
