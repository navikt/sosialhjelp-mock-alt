export type AdressebeskyttelseType = 'UGRADERT' | 'STRENGT_FORTROLIG' | 'STRENGT_FORTROLIG_UTLAND' | 'FORTROLIG';

export const Adressebeskyttelse: { [key in AdressebeskyttelseType]: string } = {
    UGRADERT: 'Ugradert',
    STRENGT_FORTROLIG: 'Strengt fortrolig (kode 6)',
    STRENGT_FORTROLIG_UTLAND: 'Strengt fortrolig utland (kode 6)',
    FORTROLIG: 'Fortrolig (kode 7)',
};
