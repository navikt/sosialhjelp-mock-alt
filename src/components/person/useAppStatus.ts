import { useReducer } from 'react';

export interface AppStatusState {
    status: 'loading' | 'success' | 'fetchError' | 'postError';
    errorMessage: string | undefined;
}

export type AppStatusAction =
    | { type: 'success' }
    | { type: 'loading' }
    | { type: 'fetchError'; msg: string }
    | { type: 'postError'; msg: string };

function appStatusReducer(state: AppStatusState, action: AppStatusAction) {
    switch (action.type) {
        case 'success':
            return { ...state, status: action.type };
        case 'loading':
            return { ...state, status: action.type };
        case 'fetchError':
            return { ...state, status: action.type, errorMessage: action.msg };
        case 'postError':
            return { ...state, status: action.type, errorMessage: action.msg };
        default:
            return state;
    }
}

const initialAppStatusState: AppStatusState = {
    status: 'loading',
    errorMessage: undefined,
};

export function useAppStatus() {
    const [appStatus, dispatchAppStatus] = useReducer(appStatusReducer, initialAppStatusState);

    return { appStatus, dispatchAppStatus };
}
