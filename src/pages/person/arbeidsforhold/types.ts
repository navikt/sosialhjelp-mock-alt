export enum ArbeidsforholdType {
    PERSON = 'Person',
    ORGANISASJON = 'Organisasjon',
}

export interface ArbeidsforholdObject {
    type: string;
    id: string;
    startDato: string;
    sluttDato: string;
    stillingsProsent: string;
    ident: string;
    orgnummer: string;
    orgnavn: string;
}
