import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import './App.css';

function App() {
  return (

    <Router>

      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/home" element={ <ProtectedRoutes> <Home /> </ProtectedRoutes>}/>
        
      </Routes>

    </Router>

  );
}

export default App;
