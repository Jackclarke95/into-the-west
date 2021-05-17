import React from "react";
import "./App.css";
import TestCharacters from "./Components/TestCharacters";
import Character from "./Components/Character";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import TestImages from "./Components/TestImages";

function App() {
  return (
    <div>
      <h1>Into The West</h1>
      <Character
        character={{
          "avatar-link": "11867/502/1581111423-32902489.jpeg",
          classes: [
            {
              class: "Cleric",
              level: 2,
            },
            {
              class: "Artificer",
              level: 7,
            },
          ],
          id: 32902489,
          name: "Caduceus",
          nickname: "C.A.D.",
          "player-dndbeyond-name": "ThePerkyRiolu",
          race: "???",
          "starting-level": 9,
        }}
      />
      <TestCharacters />
      <TestSessions />
      <TestEncounters />
      <TestImages name="Eslyn.jpeg" />
    </div>
  );
}

export default App;
