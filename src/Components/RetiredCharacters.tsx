import CharacterCard from "./CharacterCard";

const Characters = ({
  characters,
  sessions,
  players,
  currentPlayer = null as null | any,
}) => {
  let activeCharacters = [] as any[];
  let retiredCharacters = [] as any[];

  characters.map((character) => {
    if (character.value.retirement === undefined) {
      activeCharacters.push(character);
    } else {
      retiredCharacters.push(character);
    }
  });

  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          textAlign: "center",
          fontFamily: "Papyrus",
          fontSize: "2em",
          fontWeight: "bold",
        }}
      >
        Retired Characters
      </h2>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="retired-character-cards">
          {Object.keys(retiredCharacters).map((key) => {
            let character = retiredCharacters[key];
            let characterPlayer = {};

            if (currentPlayer) {
              players.map((player) => {
                if (
                  player["dndbeyond-name"] ===
                  character.value["player-dndbeyond-name"]
                ) {
                  characterPlayer = player;
                }

                return null;
              });
            }

            return (
              <CharacterCard
                key={key}
                characterKey={character.key}
                character={character.value}
                sessions={sessions}
                player={characterPlayer}
                currentPlayer={currentPlayer}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Characters;

// {Object.keys(retiredCharacters).map((key) => {
//   let character = retiredCharacters[key];
//   let characterPlayer = {};

//   if (currentPlayer) {
//     players.map((player) => {
//       if (
//         player["dndbeyond-name"] ===
//         character.value["player-dndbeyond-name"]
//       ) {
//         characterPlayer = player;
//       }

//       return null;
//     });
//   }

//   return (
//     <CharacterCard
//       key={key}
//       characterKey={character.key}
//       character={character.value}
//       sessions={sessions}
//       player={characterPlayer}
//       currentPlayer={currentPlayer}
//     />
//   );
// })}
