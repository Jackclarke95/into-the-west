import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../../Types/LocalStructures";
import ClassIcon from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import XpBar from "../XpBar";

const CharactersPage = () => {
  const navigate = useNavigate();

  const characters = useSelector((state) => state.characters);

  const ListCharacter: React.FC<{ character: Character }> = ({ character }) => {
    const renderCharacterClasses = (): JSX.Element[] => {
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

    const onClickNavigateToCharacter = () => {
      navigate(`/characters/${character.id}`);
    };

    return (
      <div
        onClick={onClickNavigateToCharacter}
        key={character.id}
        className="list-item character clickable"
      >
        <div className="character-body">
          <img
            className="avatar"
            src={character.avatarUrl ?? DefaultAvatar}
            alt={`${character.fullName} Avatar`}
            title={`${character.fullName} Avatar`}
          />
          <div className="character-details">
            <div>{character.fullName}</div>
            <div className="classes">{renderCharacterClasses()}</div>
          </div>
        </div>
        <XpBar character={character} />
      </div>
    );
  };

  const CharactersTable = () => {
    if (characters.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <table className="characters">
        <thead>
          <tr>
            <th className="name">Name</th>
            <th className="class">Class</th>
            <th className="level">Level</th>
            <th className="xp">XP</th>
          </tr>
        </thead>
        <tbody>
          {characters.data.map((character) => (
            <tr>
              <td className="name">
                <Link to={`/characters/${character.id}`}>
                  {character.fullName}
                </Link>
              </td>
              <td className="class">
                {character.classes.map((cls) => cls.class).join(", ")}
              </td>
              <td className="level">
                {character.classes.map((cls) => cls.level).join(", ")}
              </td>
              <td className="xp">
                <XpBar character={character} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="page characters-page">
      <h2>Characters</h2>
      <div className="list">
        {characters.isLoading ? <div>Loading...</div> : <CharactersTable />}
      </div>
    </div>
  );
};

export default CharactersPage;
