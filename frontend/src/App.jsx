import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import ProtectedRoutes from "./Features/Auth/ProtectedRoutes.jsx";
import AuthRedirector from "./Features/Auth/AuthRedirector.js";
import Home from "./pages/HomePage/HomePage.jsx";

// import './App.css';
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

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>

      </Routes>
      
    </Router>
  );
}

export default App;