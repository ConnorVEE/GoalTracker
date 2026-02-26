import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Tasks from "./pages/tasks";
import Goals from "./pages/goals";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import MainLayout from "./components/layouts/MainLayout"
import AuthRedirector from "./components/auth/AuthRedirector";

// HomeV2 placeholder for new home page design under development
import HomeV2 from "./pages/HomeV2/HomeV2.jsx";

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

          {/* V1 routes WITH layout */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
          </Route>

          {/* V2 route WITHOUT layout */}
          <Route path="/home-v2" element={<HomeV2 />} />
        </Route>

      </Routes>
      
    </Router>
  );
}

export default App;