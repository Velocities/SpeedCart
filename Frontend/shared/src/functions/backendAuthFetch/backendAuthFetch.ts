import { BASE_URL, TESTING_MODE } from '@constants';

/**
 * A utility function for making authenticated API requests to the backend.
 * Automatically includes credentials and Authorization headers when needed.
 */
export const backendAuthFetch = async (endpoint: string, options: RequestInit = {}, authToken = '') => {
    const headersInit: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
    };

    const headers: Headers = new Headers(headersInit);

    if (TESTING_MODE && authToken !== '') {
        headers.set("Authorization", `Bearer ${authToken}`);
    }

    const fetchOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include',
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
};