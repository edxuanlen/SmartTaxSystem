// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { getTokenFromCookie } from '../utils/cookie';

interface AuthContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = await getTokenFromCookie();
            if (token === undefined) {
                return;
            }
            try {
                const response = await axios.get('/api/current_user/', {
                    headers: { Authorization: `Token ${token}` }
                });
                message.info('User fetched successfully');
                setUser(response.data.user);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div style={{ maxWidth: '95%', margin: '0 auto' }}>
            <AuthContext.Provider value={{ user, setUser }}>
                {children}
            </AuthContext.Provider>
        </div>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
