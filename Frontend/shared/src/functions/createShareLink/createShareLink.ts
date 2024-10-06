import { BASE_URL } from '@constants';

export const createShareLink = async (shareListId: string, permissions: any) => {
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