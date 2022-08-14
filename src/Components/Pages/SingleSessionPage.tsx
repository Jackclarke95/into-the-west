import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleSessionPage = () => {
  const { sessionId } = useParams();

  const sessions = useSelector((state) => state.sessions);

  const session = sessions.isLoading
    ? undefined
    : sessions.data.find((session) => session.id === sessionId);

  return (
    <div className="page single-session-page">
      <h2>{session ? session.name : "Loading"}</h2>
    </div>
  );
};

export default SingleSessionPage;
