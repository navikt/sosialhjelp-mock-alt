import { SakerDtoRolle, SakerDtoStatus, UtbetalingerDtoMottaker } from '../../../generated/model';

export const mottakerLabel: Record<UtbetalingerDtoMottaker, string> = {
    KOMMUNE: 'Kommunen',
    HUSSTAND: 'Husstand',
};

export const statusLabel: Record<SakerDtoStatus, string> = {
    VEDTATT: 'Vedtak er fattet',
    UNDER_BEHANDLING: 'Under behandling',
};

export const rolleLabel: Record<SakerDtoRolle, string> = {
    HOVEDPERSON: 'Hovedperson',
    BIPERSON: 'Biperson',
};
