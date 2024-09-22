import { BASE_URL } from '@constants';

export const createSharingPermissions = async (token: string) => {
    return fetch(`${BASE_URL}/share/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}