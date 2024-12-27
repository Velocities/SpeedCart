import { BASE_URL, TESTING_MODE } from '@constants';

export const fetchSharedShoppingLists = (authToken = '') => {
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (TESTING_MODE && authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${BASE_URL}/shopping-lists/shared`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
    });
};