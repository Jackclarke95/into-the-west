import CharacterCard from "./CharacterCard";

const Characters = ({
  characters,
  sessions,
  players,
  currentUser = null as null | any,
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>{`Characters (${characters.length})`}</h2>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {Object.keys(characters).map((key) => {
            let character = characters[key];
            let characterPlayer = {};

            if (currentUser) {
              players.map((player) => {
                if (
                  player["dndbeyond-name"] ===
                  character.value["player-dndbeyond-name"]
                ) {
                  characterPlayer = player;
                }
              });
            }

            return (
              <CharacterCard
                key={key}
                characterKey={character.key}
                character={character.value}
                sessions={sessions}
                player={characterPlayer}
                currentUser={currentUser}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Characters;
