import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CharacterCard from "../CharacterCard";

const SingleCharacterPage = () => {
  const { characterId } = useParams();

  const characters = useSelector((state) => state.characters);

  const character = characters.isLoading
    ? undefined
    : characters.data.find((character) => character.id === characterId);

  return (
    <div className="page single-character-page">
      {characters.isLoading && "Loading..."}
      {!character ? "Not found" : <CharacterCard character={character} />}
    </div>
  );
};

export default SingleCharacterPage;
