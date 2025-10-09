import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthRedirector = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Define all public entry points that should NOT trigger a redirect
        const publicPaths = ['/', '/register'];
        const currentPath = window.location.pathname;

        // Redirect only after loading is done and the user is NOT authenticated
        if (!loading && !isAuthenticated) {
            
            // If the current path is NOT on the list of allowed public paths, redirect to login (/).
            if (!publicPaths.includes(currentPath)) {
                navigate('/');
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return null; 
};

export default AuthRedirector;