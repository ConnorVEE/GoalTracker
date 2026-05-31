import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './Features/Tasks/Contexts/TaskContext.jsx';
import { GoalProvider } from './Features/Goals/Contexts/GoalContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
        <AuthProvider>
          <GoalProvider>
            <TaskProvider>
              <App />
            </TaskProvider>
          </GoalProvider>
        </AuthProvider>

      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);