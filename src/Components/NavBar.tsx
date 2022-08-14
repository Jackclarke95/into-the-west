import { NavLink } from "react-router-dom";
import Card from "./Surfaces/Card";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <NavLink to="/" className="nav-item">
        Home
      </NavLink>
      <NavLink to="/characters" className="nav-item">
        Characters
      </NavLink>
      <NavLink to="/sessions" className="nav-item">
        Session
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        Profile
      </NavLink>
    </nav>
  );
};

export default NavBar;
