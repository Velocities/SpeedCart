import { BASE_URL, TESTING_MODE } from '@constants';

export const createShareLink = async (authToken = '', shareListId: string, permissions: any) => {
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (TESTING_MODE && authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${BASE_URL}/share/${shareListId}`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(
            permissions
        ),
    });
}