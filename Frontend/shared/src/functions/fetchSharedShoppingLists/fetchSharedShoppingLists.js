import { BASE_URL } from '@constants/config';

export const fetchSharedShoppingLists = () => {
    return fetch(`${BASE_URL}/shopping-lists/shared`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include' // Include cookies in the request
    });
};