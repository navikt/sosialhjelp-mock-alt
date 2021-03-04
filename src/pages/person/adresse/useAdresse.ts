import { useReducer } from 'react';

export interface AdresseState {
    adressenavn: string;
    husnummer: string;
    postnummer: string;
    kommunenummer: string;
    validHusnummer: boolean;
}

export type AdresseAction =
    | { type: 'adressenavn'; value: string }
    | { type: 'husnummer'; value: string }
    | { type: 'postnummer'; value: string }
    | { type: 'kommunenummer'; value: string }
    | { type: 'validHusnummer'; value: boolean };

function adresseReducer(state: AdresseState, action: AdresseAction) {
    return { ...state, [action.type]: action.value };
}

const initialAdresseState: AdresseState = {
    adressenavn: 'Mulholland Drive',
    husnummer: '42',
    postnummer: '0101',
    kommunenummer: '0301',
    validHusnummer: true,
};

export function useAdresse() {
    const [adresseState, dispatchAdresse] = useReducer(adresseReducer, initialAdresseState);

    return { adresseState, dispatchAdresse };
}
