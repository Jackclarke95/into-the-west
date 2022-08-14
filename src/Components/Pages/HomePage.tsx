import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="page home-page">
      <h2 className="title">Home</h2>
      <Link to="/characters">Characters</Link>
      <Link to="/sessions">Sessions</Link>
    </div>
  );
};

export default HomePage;
