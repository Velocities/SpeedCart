import { BASE_URL, TESTING_MODE } from '@constants';

export const createSharingPermissions = async (authToken = '', token: string) => {
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (TESTING_MODE && authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${BASE_URL}/share/${token}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
    });
}