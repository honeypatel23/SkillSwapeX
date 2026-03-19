import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted login
        const storedUser = localStorage.getItem('skillswape_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Determine role and set user
        // userData should include: { name, email, role, token, ... }
        setUser(userData);
        localStorage.setItem('skillswape_user', JSON.stringify(userData));
        return userData.role;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('skillswape_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
