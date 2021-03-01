import * as React from 'react';
import styled from 'styled-components';
import { Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { flexWrap } from '../../../styling/Styles';
import { Undertittel } from 'nav-frontend-typografi';
import { AdresseAction, AdresseState } from './useAdresse';

export const AdresseSkjemaGruppe = styled(SkjemaGruppe)`
    ${flexWrap};

    input {
        width: 5rem;
    }

    .gateAdresse {
        flex: 1 1 29rem;
        input {
            width: 100%;
        }
    }
    .kommunenr {
        max-width: 5rem;
    }
`;

interface Props {
    lockedMode?: boolean;
    state: AdresseState;
    dispatch: React.Dispatch<AdresseAction>;
}

const Adresse = (props: Props) => {
    const { lockedMode, state, dispatch } = props;

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
                onChange={(e) => dispatch({ type: 'husnummer', value: parseInt(e.target.value) })}
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
