import React from 'react';

// Create an interface for AuthContext
export interface AuthContextType {
    isAuthenticated: boolean;
    userPicture: string | null;
    login: (token: string) => void;
    logout: () => void;
}