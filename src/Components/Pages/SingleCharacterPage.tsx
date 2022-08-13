import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./SingleCharacterPage.scss";

const SingleCharacterPage = () => {
  const { characterId } = useParams();

  const params = useParams();

  const characters = useSelector((state) => state.characters);

  const character = characters.isLoading
    ? undefined
    : characters.data.find((character) => character.id === params.characterId);

  console.log({ params });
  console.log(params.productId);
  console.log({ characterId });

  return (
    <div className="page single-character-page">
      <Link to="/characters">Characters (Back)</Link>
      <div className="title">Character Page</div>
      <div>{character ? character.fullName : "Loading"}</div>
    </div>
  );
};

export default SingleCharacterPage;
