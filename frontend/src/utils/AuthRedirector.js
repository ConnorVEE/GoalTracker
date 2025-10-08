import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthRedirector = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect only after loading is done and the user is NOT authenticated
        if (!loading && !isAuthenticated) {
            // Prevent navigation if we are already on the login page
            if (window.location.pathname !== '/') {
                navigate('/');
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return null; 
};

export default AuthRedirector;