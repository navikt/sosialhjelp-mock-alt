import styled from 'styled-components';
import { Button, Fieldset, Panel, Select, TextField } from '@navikt/ds-react';
import { flexWrap, theme } from './theme';

export const Bold = styled.span`
    font-weight: bold;
`;

export const StyledPanel = styled(Panel)`
    margin-bottom: 1rem;
    overflow: auto;
`;

export const StyledSelect = styled(Select)`
    width: fit-content;
`;

export const AvbrytKnapp = styled(Button).attrs({ variant: 'secondary' })``;

export const StyledInput = styled(TextField)<{ htmlSize?: number }>`
    input {
        max-width: ${(props) => (props.htmlSize ? `${props.htmlSize}rem` : 'inherit')};
    }
`;

export const FlexWrapper = styled.div`
    ${flexWrap}
`;

export const Knappegruppe = styled.div`
    ${flexWrap};

    margin-top: 2rem;
`;

export const StyledFieldset = styled(Fieldset)`
    legend {
        // same as .navds-ingress
        font-size: var(--navds-font-size-xlarge);
        font-weight: var(--navds-font-weight-regular);
        letter-spacing: -0.001em;
        line-height: var(--navds-font-line-height-xlarge);
        margin: 0;
    }

    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
`;

export const SmallTextField = styled(TextField)`
    input {
        max-width: 7rem;
    }
`;

export const DefinitionList = styled.dl<{ labelWidth?: number }>`
    margin: 0;
    overflow: auto;
    line-height: 1.5;
    &:after {
        content: '';
        clear: both;
    }

    --dtWidth: ${(props) => (props.labelWidth ? `${props.labelWidth}%` : '22%')};
    --ddWidth: ${(props) => (props.labelWidth ? `${90 - props.labelWidth}%` : '68%')};

    dt {
        float: left;
        clear: left;
        font-weight: bold;
        min-width: var(--dtWidth);
        margin-right: 0.5rem;
        &::after {
            content: ': ';
        }

        @media ${theme.mobileMaxWidth} {
            min-width: initial;
        }
    }
    dd {
        float: left;
        margin: 0;
        max-width: var(--ddWidth);
    }
`;
