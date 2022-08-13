import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./SessionsPage.scss";

const CharactersPage = () => {
  const sessions = useSelector((state) => state.sessions);

  return (
    <div className="page sessions-page">
      <Link to="/">Home (Back)</Link>
      <div className="title">Sessions</div>
      <div className="sessions-list">
        {sessions.isLoading ? (
          <div>Loading...</div>
        ) : (
          sessions.data.map((session) => <div>{session.name}</div>)
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
