import React from 'react';
import { AuthContextType } from './AuthContextType';
declare module 'AuthContext' {
    export const AuthProvider: React.FC<{ children: React.ReactNode }>;
    export const useAuth: AuthContextType;
}