import styled, { css } from 'styled-components/macro';
import Panel from 'nav-frontend-paneler';
import { Input, Select } from 'nav-frontend-skjema';

export const theme = {
    mobileMaxWidth: 'only screen and (max-width: 30em)',
};

export const Bold = styled.span`
    font-weight: bold;
`;

export const StyledPanel = styled(Panel)`
    margin-bottom: 1rem;
`;

export const StyledSelect = styled(Select)`
    margin-bottom: 1rem;
    width: fit-content;
    .selectContainer {
        margin-right: 1rem;
    }
`;

export const StyledInput = styled(Input)<{ size?: number }>`
    input {
        max-width: ${(props) => (props.size ? `${props.size}rem` : '10rem')};
    }
`;

export const flexWrap = css`
    display: flex;
    flex-wrap: wrap;

    // default margin på alle children
    > * {
        margin: 0 0.5rem 0.5rem 0;
    }

    > *:last-child {
        margin-right: 0;
    }
`;

export const FlexWrapper = styled.div`
    ${flexWrap}
`;

export const Knappegruppe = styled.div`
    ${flexWrap};

    margin-top: 2rem;
`;

export const DefinitionList = styled.dl<{ labelWidth?: number }>`
    margin: 0;
    overflow: auto;
    line-height: 1.5;
    &:after {
        content: '';
        clear: both;
    }

    dt {
        float: left;
        clear: left;
        font-weight: bold;
        min-width: ${(props) => (props.labelWidth ? `${props.labelWidth}rem` : '8.5rem')};
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
    }
`;
