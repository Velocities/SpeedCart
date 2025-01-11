// Create an interface for AuthContext
export interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    authToken: string;
    userPictureLink: string | null;
    login: (token: string) => void;
    logout: () => void;
    // Adding the callBackendAPI function
  callBackendAPI: <TArgs, TResult>(
    endpointFunc: (authToken: string, args: TArgs) => Promise<TResult>,
    args: TArgs
  ) => Promise<TResult>;
}