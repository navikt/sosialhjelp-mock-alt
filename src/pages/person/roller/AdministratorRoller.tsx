import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Knappegruppe, StyledPanel } from '../../../styling/Styles';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import SletteKnapp from '../../../components/SletteKnapp';
import { FrontendPersonaliaAdministratorRollerItem } from '../../../generated/model';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

const adminTekst = (rolle: FrontendPersonaliaAdministratorRollerItem) =>
    rolle === FrontendPersonaliaAdministratorRollerItem.MODIA_VEILEDER
        ? 'Modiaveileder (har tilgang til Modia sosial)'
        : rolle;

export const AdministratorRollerPanel = (props: {
    initialRoller: FrontendPersonaliaAdministratorRollerItem[];
    setRoller: (data: FrontendPersonaliaAdministratorRollerItem[]) => void;
}) => {
    const { setRoller, initialRoller } = props;
    const [checkboxState, setCheckboxState] = useState<FrontendPersonaliaAdministratorRollerItem[]>(initialRoller);

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
                    onChange={(value: FrontendPersonaliaAdministratorRollerItem[]) => setCheckboxState(value)}
                    value={checkboxState}
                >
                    <Checkbox value={FrontendPersonaliaAdministratorRollerItem.MODIA_VEILEDER}>
                        {adminTekst(FrontendPersonaliaAdministratorRollerItem.MODIA_VEILEDER)}
                    </Checkbox>
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

export const VisAdministratorRoller = ({
    roller,
    lockedMode,
    setIsEditing,
    onSlett,
}: {
    roller: FrontendPersonaliaAdministratorRollerItem[];
    lockedMode: boolean;
    setIsEditing: () => void;
    onSlett: () => void;
}) => {
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
                {roller.map((rolle) => {
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
