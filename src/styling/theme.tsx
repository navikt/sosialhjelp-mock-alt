import { css } from 'styled-components';

export const theme = {
    mobileMaxWidth: 'only screen and (max-width: 30em)',
};

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
