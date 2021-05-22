import CharacterCard from "./CharacterCard";

const Characters = ({ characters, sessions, player = null as null | any }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>{`Characters (${characters.length})`}</h2>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {Object.keys(characters).map((key) => (
            <CharacterCard
              key={key}
              characterKey={characters[key].key}
              character={characters[key].value}
              sessions={sessions}
              player={player}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Characters;
