import React from 'react';
import {AuthContextType} from './AuthContext';
declare module 'AuthContext' {
    export const AuthProvider: React.FC<{ children: React.ReactNode }>;
    export const useAuth: AuthContextType;
}