export type VedtakKodeType = 'V00' | 'V02' | 'V03' | 'V04' | 'V05' | 'V07' | 'V09' | 'V11' | 'V12' | 'V48';

export const Vedtakskode: { [key in VedtakKodeType]: string } = {
    V00: 'Søknaden din er innvilget.',
    V02: 'Du har fått avslag på søknaden din om bostøtte fordi du eller andre i husstanden ikke har rett til bostøtte.',
    V03: 'Du har fått avslag på søknaden din om bostøtte fordi du/dere hadde for høy inntekt.',
    V04: 'Du har fått avslag på søknaden din om bostøtte fordi boligen din ikke oppfyller kravene.',
    V05: 'Du har fått avslag på søknaden din om bostøtte fordi du ikke var registrert på søknadsadressen i folkeregisteret.',
    V07: 'Klagen din ble avvist da den ble sendt inn etter klagefristen.',
    V09: 'Søknaden din om bostøtte er avvist fordi det mangler opplysninger eller dokumentasjon, eller fordi noen i husstanden er registrert på en annen søknad.',
    V11: 'Hovedperson er død',
    V12: 'For høy anslått inntekt (ikke i bruk lengre)',
    V48: 'Søknaden din om bostøtte er avvist fordi noen du bor sammen med ikke er registrert på adressen i folkeregisteret.',
};

export function getVedtakstype(vedtak: VedtakKodeType): string {
    return vedtak === 'V00' ? 'INNVILGET' : 'AVSLAG';
}
