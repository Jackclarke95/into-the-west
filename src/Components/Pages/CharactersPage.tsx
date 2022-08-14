import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CharactersPage = () => {
  const characters = useSelector((state) => state.characters);

  return (
    <div className="page characters-page">
      <h2>Characters</h2>
      <div className="list">
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
