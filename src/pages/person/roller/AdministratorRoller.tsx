import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knappegruppe, StyledPanel } from '../../../styling/Styles';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import SletteKnapp from '../../../components/SletteKnapp';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
    initialRoller: AdminRolle[];
    setRoller: (data: any) => void;
}

export enum AdminRolle {
    MODIA_VEILEDER = 'MODIA_VEILEDER',
}

const adminTekst = (rolle: AdminRolle) => {
    if (rolle === AdminRolle.MODIA_VEILEDER) {
        return 'Modiaveileder (har tilgang til Modia sosial)';
    }
    return rolle;
};
export const AdministratorRollerPanel = (props: Props) => {
    const { setRoller, initialRoller } = props;
    const [checkboxState, setCheckboxState] = useState<AdminRolle[]>(initialRoller);

    const onLagre = (event: ClickEvent) => {
        setRoller(checkboxState);
        event.preventDefault();
    };

    const onCancel = () => {
        setCheckboxState(initialRoller);
        setRoller(initialRoller);
    };

    return (
        <Collapse isOpened>
            <StyledPanel>
                <CheckboxGroup
                    legend="Administratorrolle"
                    onChange={(value: AdminRolle[]) => setCheckboxState(value)}
                    value={checkboxState}
                >
                    <Checkbox value={AdminRolle.MODIA_VEILEDER}>{adminTekst(AdminRolle.MODIA_VEILEDER)}</Checkbox>
                </CheckboxGroup>
                <Knappegruppe>
                    <Button
                        variant="secondary"
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}
                    >
                        Lagre
                    </Button>
                    <Button variant="secondary" onClick={onCancel} className="leftPadding">
                        Avbryt
                    </Button>
                </Knappegruppe>
            </StyledPanel>
        </Collapse>
    );
};

interface ViseProps {
    roller: AdminRolle[];
    lockedMode: boolean;
    setIsEditing: () => void;
    onSlett: () => void;
}

export const VisAdministratorRoller = ({ roller, lockedMode, setIsEditing, onSlett }: ViseProps) => {
    if (roller.length === 0 && !lockedMode) {
        return (
            <Button variant="secondary" onClick={setIsEditing}>
                Legg til rolle
            </Button>
        );
    }
    return (
        <StyledPanel>
            <StyledList>
                {roller.map((rolle: AdminRolle) => {
                    return <li key={rolle}>{adminTekst(rolle)}</li>;
                })}
            </StyledList>
            {!lockedMode && (
                <ButtonGroup>
                    <Button variant="secondary" onClick={setIsEditing}>
                        Endre
                    </Button>
                    <SletteKnapp onClick={onSlett} />
                </ButtonGroup>
            )}
        </StyledPanel>
    );
};

const StyledList = styled.ul`
    margin-top: 0;
    padding-inline-start: var(--navds-spacing-4);
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
