import { GroceryItem } from '@types';
import { backendAuthFetch } from "../backendAuthFetch";
import { BackendFunction } from "@types";

export const createGroceryItem: BackendFunction<
  { item: GroceryItem },
  Response
> = async (authToken = '', { item }) => {

  return backendAuthFetch(
    `/grocery-items`,
    {
      method: 'POST',
      body: JSON.stringify(item),
    },
    authToken
  );
};