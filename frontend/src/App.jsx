import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Tasks from "./pages/tasks";
import Goals from "./pages/goals";

import './App.css';

function App() {
  return (

    <Router>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={ <ProtectedRoutes> <Home /> </ProtectedRoutes>}/>
        <Route path="/tasks" element={ <ProtectedRoutes> <Tasks /> </ProtectedRoutes>}/>
        <Route path="/goals" element={ <ProtectedRoutes> <Goals /> </ProtectedRoutes>}/>

        <Route path="/register" element={<Register />} />
        
      </Routes>

    </Router>

  );
}

export default App;
