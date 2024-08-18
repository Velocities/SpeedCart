import { BASE_URL } from '@constants/config';

export const createShareLink = async (shareListId, permissions) => {
    return fetch(`${BASE_URL}/share/${shareListId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(
            permissions
        ),
    });
}