import { useMemo, useReducer } from 'react';
import { ForenkletBostedsadresse } from '../../../generated/model';

export interface AdresseState {
    adressenavn: string;
    husnummer: string;
    husbokstav: string;
    postnummer: string;
    kommunenummer: string;
    validHusnummer: boolean;
}

export type AdresseAction =
    | { type: 'initialize'; value: ForenkletBostedsadresse }
    | { type: 'adressenavn'; value: string }
    | { type: 'husnummer'; value: string }
    | { type: 'husbokstav'; value: string | undefined }
    | { type: 'postnummer'; value: string }
    | { type: 'kommunenummer'; value: string }
    | { type: 'validHusnummer'; value: boolean };

function adresseReducer(state: AdresseState, action: AdresseAction) {
    if (action.type === 'initialize') {
        return { ...state, ...(action.value as unknown as AdresseState), validHusnummer: true };
    }
    return { ...state, [action.type]: action.value };
}

const initialAdresseState: AdresseState = {
    adressenavn: 'Mulholland Drive',
    husnummer: '42',
    husbokstav: '',
    postnummer: '0101',
    kommunenummer: '0301',
    validHusnummer: true,
};

export function useAdresse() {
    const [adresseState, dispatchAdresse] = useReducer(adresseReducer, initialAdresseState);
    const bostedsadresse: ForenkletBostedsadresse = useMemo(
        () => ({
            ...{
                ...adresseState,
                husnummer: parseInt(adresseState.husnummer),
                validHusnummer: undefined,
            },
        }),
        [adresseState]
    );
    return { adresseState, bostedsadresse, dispatchAdresse };
}
