// Create an interface for AuthContext
export interface AuthContextType {
    isAuthenticated: boolean;
    userPictureLink: string | null;
    login: (token: string) => void;
    logout: () => void;
}