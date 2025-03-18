import { BASE_URL, TESTING_MODE } from '@constants';
import { BackendFunction } from "@types";

export const fetchSharedShoppingLists: BackendFunction<
  {},
  Response
> = (authToken = '') => {
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