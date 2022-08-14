import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Character } from "../../Types/LocalStructures";
import ClassIcon from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import XpBar from "../XpBar";

const CharactersPage = () => {
  const characters = useSelector((state) => state.characters);
  const navigate = useNavigate();

  const CharactersTable = () => {
    if (characters.isLoading) {
      return <div>Loading...</div>;
    }

    const renderCharacterClasses = (character: Character): JSX.Element[] => {
      return [...character.classes]
        .sort((a, b) => b.level - a.level)
        .map((cls) => (
          <div className="class-container">
            <ClassIcon key={cls.class} className={cls.class} />
            <div className="class-name">
              {character.classes.length > 1
                ? `${cls.class} (${cls.level})`
                : cls.class}
            </div>
          </div>
        ));
    };

    const onClickCharacter = (character: Character) => {
      navigate(`/characters/${character.id}`);
    };

    return (
      <div className="table character-table">
        <div className="header">
          <div className="header-cell avatar" />
          <div className="header-cell name">Name</div>
          <div className="header-cell class">Class</div>
          <div className="header-cell level">Level</div>
          <div className="header-cell xp">XP</div>
        </div>
        <div className="body">
          {characters.data.map((character) => (
            <div
              className="row clickable"
              key={character.id}
              onClick={() => onClickCharacter(character)}
            >
              <div className="cell avatar">
                <img
                  className="avatar"
                  src={character.avatarUrl ?? DefaultAvatar}
                  alt={`${character.fullName} Avatar`}
                  title={`${character.fullName} Avatar`}
                />
              </div>
              <div className="cell name">{character.fullName}</div>
              <div className="cell class">
                {renderCharacterClasses(character)}
              </div>
              <div className="cell level">{character.currentLevel}</div>
              <div className="cell xp">
                <XpBar character={character} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page characters-page">
      <h2>Characters</h2>
      {characters.isLoading ? <div>Loading...</div> : <CharactersTable />}
    </div>
  );
};

export default CharactersPage;
