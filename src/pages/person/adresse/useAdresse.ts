import { useReducer } from 'react';

export interface AdresseState {
    adressenavn: string;
    husnummer: number;
    postnummer: string;
    kommunenummer: string;
}

export type AdresseAction =
    | { type: 'adressenavn'; value: string }
    | { type: 'husnummer'; value: number }
    | { type: 'postnummer'; value: string }
    | { type: 'kommunenummer'; value: string };

function adresseReducer(state: AdresseState, action: AdresseAction) {
    return { ...state, [action.type]: action.value };
}

const initialAdresseState: AdresseState = {
    adressenavn: 'Mulholland Drive',
    husnummer: 42,
    postnummer: '0101',
    kommunenummer: '0301',
};

export function useAdresse() {
    const [adresseState, dispatchAdresse] = useReducer(adresseReducer, initialAdresseState);

    return { adresseState, dispatchAdresse };
}
