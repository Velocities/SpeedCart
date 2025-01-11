import { backendAuthFetch } from "../backendAuthFetch";
import { BackendFunction } from "@types";

export const createShoppingList: BackendFunction<
  { name: string; routeId: any },
  Response
> = async (authToken = '', { name, routeId }) => {
  return backendAuthFetch(
    `/shopping-lists`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        route_id: routeId
      }),
    },
    authToken
  );
};