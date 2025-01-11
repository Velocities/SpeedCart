import { backendAuthFetch } from "../backendAuthFetch";
import { BackendFunction } from "@types";

export const createShareLink: BackendFunction<
{ shareListId: string; permissions: string },
Response
> = async (
  authToken = '',
  {shareListId,
  permissions}
) => {
  return backendAuthFetch(
    `/share/${shareListId}`,
    {
      method: 'POST',
      body: JSON.stringify(permissions),
    },
    authToken
  );
};
