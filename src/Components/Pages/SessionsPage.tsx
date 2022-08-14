import { useSelector } from "react-redux";

const CharactersPage = () => {
  const sessions = useSelector((state) => state.sessions);

  return (
    <div className="page sessions-page">
      <h2>Sessions</h2>
      <div className="list">
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
