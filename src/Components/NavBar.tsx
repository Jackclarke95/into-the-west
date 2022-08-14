import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <NavLink to="/" className="nav-item">
        Home
      </NavLink>
      <NavLink to="/characters" className="nav-item" end>
        Characters
      </NavLink>
      <NavLink to="/sessions" className="nav-item" end>
        Session
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        Profile
      </NavLink>
    </nav>
  );
};

export default NavBar;
