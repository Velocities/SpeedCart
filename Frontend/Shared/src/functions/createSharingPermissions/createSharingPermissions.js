import { BASE_URL } from "@constants/config";

export const createSharingPermissions = async (token) => {
    return fetch(`${BASE_URL}/share/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
}