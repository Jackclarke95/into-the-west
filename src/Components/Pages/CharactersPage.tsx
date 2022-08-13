import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./CharactersPage.scss";

const CharactersPage = () => {
  const characters = useSelector((state) => state.characters);

  return (
    <div className="page characters-page">
      <Link to="/">Home (Back)</Link>
      <div className="title">Characters</div>
      <div className="characters-list">
        {characters.isLoading ? (
          <div>Loading...</div>
        ) : (
          characters.data.map((character) => (
            <Link to={`${character.id}`}>{character.fullName}</Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
