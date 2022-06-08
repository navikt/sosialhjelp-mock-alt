import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knapp } from 'nav-frontend-knapper';
import { DefinitionList, Knappegruppe, StyledPanel, StyledSelect } from '../../../styling/Styles';
import SletteKnapp from '../../../components/SletteKnapp';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export interface AdminRollerObject {
    rolle: AdminRolle;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

export enum AdminRolle {
    DIALOG_VEILEDER = 'DIALOG_VEILEDER',
    DIALOG_ADMINISTRATOR = 'DIALOG_ADMINISTRATOR',
    DIALOG_TEKNISK_ARKIV = 'DIALOG_TEKNISK_ARKIV',
    DIALOG_INNSIKKT = 'DIALOG_INNSIKKT',
    MODIA_VEILEDER = 'MODIA_VEILEDER',
}

const adminTekst = (rolle: AdminRolle) => {
    if (rolle === AdminRolle.DIALOG_VEILEDER) {
        return 'Dialogveileder (kan se og svare på meldinger)';
    } else if (rolle === AdminRolle.DIALOG_ADMINISTRATOR) {
        return 'Dialogadministrator (kan slette meldinger)';
    } else if (rolle === AdminRolle.DIALOG_TEKNISK_ARKIV) {
        return 'Dialogarkivator (kan hente ut meldinger til arkivering)';
    } else if (rolle === AdminRolle.DIALOG_INNSIKKT) {
        return 'Dialoginnsikt (kan hente ut annonyme meldinger til innsiktsarbeide)';
    } else if (rolle === AdminRolle.MODIA_VEILEDER) {
        return 'Modiaveileder (har tilgang til Modia sosial)';
    }
    return rolle;
};
export const NyttAdministratorRoller = ({ isOpen, callback }: Params) => {
    const [rolle, setRolle] = useState<AdminRolle>(AdminRolle.DIALOG_VEILEDER);

    const onLagre = (event: ClickEvent) => {
        const nyttAdministratorRollerObject: AdminRollerObject = {
            rolle: rolle,
        };

        callback(nyttAdministratorRollerObject);
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <StyledPanel>
                <StyledSelect
                    label="Administratorrolle"
                    onChange={(evt: any) => setRolle(evt.target.value)}
                    value={rolle}
                >
                    <option value={AdminRolle.DIALOG_VEILEDER}>{adminTekst(AdminRolle.DIALOG_VEILEDER)}</option>
                    <option value={AdminRolle.DIALOG_ADMINISTRATOR}>
                        {adminTekst(AdminRolle.DIALOG_ADMINISTRATOR)}
                    </option>
                    <option value={AdminRolle.DIALOG_TEKNISK_ARKIV}>
                        {adminTekst(AdminRolle.DIALOG_TEKNISK_ARKIV)}
                    </option>
                    <option value={AdminRolle.DIALOG_INNSIKKT}>{adminTekst(AdminRolle.DIALOG_INNSIKKT)}</option>
                    <option value={AdminRolle.MODIA_VEILEDER}>{adminTekst(AdminRolle.MODIA_VEILEDER)}</option>
                </StyledSelect>
                <Knappegruppe>
                    <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Knapp>
                    <Knapp
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                        className="leftPadding"
                    >
                        Avbryt
                    </Knapp>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};

interface ViseParams {
    adminRolle: AdminRollerObject;
    lockedMode: boolean;
    onSlett: () => void;
}

export const VisAdministratorRoller = ({ adminRolle, lockedMode, onSlett }: ViseParams) => {
    return (
        <StyledPanel>
            <DefinitionList labelWidth={30}>
                <dt>Rolle</dt>
                <dd>{adminTekst(adminRolle.rolle)}</dd>
            </DefinitionList>
            {!lockedMode && <SletteKnapp onClick={onSlett} />}
        </StyledPanel>
    );
};
