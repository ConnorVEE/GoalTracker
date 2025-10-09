import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthRedirector = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const publicPaths = ['/', '/register'];
        const currentPath = window.location.pathname;

        if (!isAuthenticated && !publicPaths.includes(currentPath)) {
            navigate('/');
        }

    }, [isAuthenticated, loading, navigate]);

    return null; 
};

export default AuthRedirector;