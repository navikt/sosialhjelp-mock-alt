import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse, isCancel } from 'axios';
import { getMockAltApiURL } from '../../utils/restUtils';

export const AXIOS_INSTANCE = Axios.create({
    baseURL: getMockAltApiURL(),
    xsrfCookieName: 'XSRF-TOKEN-SOKNAD-API',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    withCredentials: true,
    headers: { Accept: 'application/json, text/plain, */*' },
});

interface CancellablePromise<T> extends Promise<T> {
    cancel?: () => void;
}

/**
 * Digisos Axios client
 */
export const axiosInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise: CancellablePromise<AxiosResponse> = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    })
        .then(({ data }) => data)
        .catch(async (e) => {
            if (isCancel(e)) return new Promise<T>(() => {});

            throw e;
        });

    promise.cancel = () => source.cancel('Query was cancelled');

    return promise as Promise<T>;
};

export type ErrorType<Error> = AxiosError<Error>;
