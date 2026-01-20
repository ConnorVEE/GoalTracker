import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthRedirector = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;
        const publicPaths = ['/', '/register'];

        if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
            navigate('/');
        }

    }, [isAuthenticated, loading, navigate, location]);

    return null; 
};

export default AuthRedirector;