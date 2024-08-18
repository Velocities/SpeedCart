import { BASE_URL } from '@constants/config';

export const fetchOwnedShoppingLists = () => {
    return fetch(`${BASE_URL}/shopping-lists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies in the request
    });
};