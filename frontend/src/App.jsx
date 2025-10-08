import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Tasks from "./pages/tasks";
import Goals from "./pages/goals";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import MainLayout from "./components/layouts/MainLayout"
import AuthRedirector from "./utils/AuthRedirector";
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>

      <Toaster 
        duration={4000}             
        position="bottom-center"    
        reverseOrder={false}
        toastOptions={{
          style: {
            maxWidth: '500px',
            padding: '16px', 
          },
        }}
        containerStyle={{
          bottom: '110px',
        }}
      />

      <AuthRedirector />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped with layout */}
        <Route element={ <ProtectedRoutes> <MainLayout/> </ProtectedRoutes> }>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
        </Route>

      </Routes>
      
    </Router>
  );
}

export default App;