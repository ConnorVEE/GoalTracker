import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Home() {

  const { logout } = useContext(AuthContext);

  return <button onClick={logout}>Logout</button>;

};
  
export default Home;
  