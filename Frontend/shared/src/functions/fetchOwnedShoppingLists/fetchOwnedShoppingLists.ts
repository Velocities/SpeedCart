import { BASE_URL } from '@constants';
import { BackendFunction } from '@types';

export const fetchOwnedShoppingLists: BackendFunction<
  {},
  Response
> = (authToken = '') => {
    const headers: any = {
        'Content-Type': 'application/json',
        "Accept" : "application/json"
    };

    if (authToken !== '') {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return fetch(`${BASE_URL}/shopping-lists`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
    });
};