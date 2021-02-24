import styled from 'styled-components/macro';
import Panel from 'nav-frontend-paneler';
import { Select } from 'nav-frontend-skjema';

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
