import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Tasks from "./pages/tasks";
import Goals from "./pages/goals";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import MainLayout from "./components/layouts/MainLayout"
import './App.css';

function App() {
  return (
    <Router>
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