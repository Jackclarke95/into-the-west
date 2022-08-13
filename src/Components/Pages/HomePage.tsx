import { Link } from "react-router-dom";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="page home-page">
      <div className="title">Home</div>
      <Link to="/characters">Characters</Link>
      <Link to="/sessions">Sessions</Link>
    </div>
  );
};

export default HomePage;
