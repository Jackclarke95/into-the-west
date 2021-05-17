import React from "react";
import "./App.css";
import TestCharacters from "./Components/TestCharacters";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import TestImages from "./Components/TestImages";

function App() {
  return (
    <div>
      <h1>Into The West</h1>
      <TestCharacters />
      <TestSessions />
      <TestEncounters />
      <TestImages name="Eslyn" />
      <TestImages name="Alavara" />
    </div>
  );
}

export default App;
