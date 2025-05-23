import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import './App.css';

function App() {
  return (

    <Router>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={ <ProtectedRoutes> <Home /> </ProtectedRoutes>}/>

        <Route path="/register" element={<Register />} />
        
      </Routes>

    </Router>

  );
}

export default App;
