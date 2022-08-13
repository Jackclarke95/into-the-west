import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./SingleSessionPage.scss";

const SingleSessionPage = () => {
  const { characterId: sessionId } = useParams();

  const params = useParams();

  const sessions = useSelector((state) => state.sessions);

  const session = sessions.isLoading
    ? undefined
    : sessions.data.find((character) => character.id === params.characterId);

  console.log({ params });
  console.log(params.productId);
  console.log({ characterId: sessionId });

  return (
    <div className="page single-session-page">
      <Link to="/sessions">Sessions (Back)</Link>
      <div className="title">Character Page</div>
      <div>{session ? session.name : "Loading"}</div>
    </div>
  );
};

export default SingleSessionPage;
