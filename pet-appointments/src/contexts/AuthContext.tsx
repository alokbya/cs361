// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IAuthUser } from '../interfaces/IUser';
import { apiClient } from '../api/client';

interface AuthContextType {
    currentUser: IAuthUser | null;
    setCurrentUser: (user: IAuthUser | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'petreminders_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<IAuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
            try {
                const parsed = JSON.parse(savedAuth) as IAuthUser;
                if (parsed && parsed.token) {
                    setCurrentUser(parsed);
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
                }
            } catch (error) {
                console.error('Failed to parse stored auth:', error);
                sessionStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.token) {
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`;
        } else {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            delete apiClient.defaults.headers.common['Authorization'];
        }
    }, [currentUser]);

    const login = async (email: string, password: string) => {
        const response = await apiClient.post<IAuthUser>('/auth/login', { email, password });
        setCurrentUser(response.data);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}