export type FolkeregisterpersonstatusType =
    | 'bosatt'
    | 'utflyttet'
    | 'forsvunnet'
    | 'doed'
    | 'opphoert'
    | 'foedselsregistrert'
    | 'midlertidig'
    | 'inaktiv'
    | 'ikkeBosatt'
    | 'aktiv';

export const Folkeregisterpersonstatus: { [key in FolkeregisterpersonstatusType]: string } = {
    bosatt: 'Bosatt',
    utflyttet: 'Utflyttet',
    forsvunnet: 'Forsvunnet',
    doed: 'Død',
    opphoert: 'Opphørt',
    foedselsregistrert: 'Fødselsregistrert',
    midlertidig: 'Midlertidig',
    inaktiv: 'Inaktiv',
    ikkeBosatt: 'Ikke bosatt',
    aktiv: 'Aktiv',
};
