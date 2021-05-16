import React from "react";
import "./App.css";
import TestCharacters from "./Components/TestCharacters";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";

function App() {
  return (
    <div>
      <h1>Into The West</h1>
      <TestCharacters />
      <TestSessions />
      <TestEncounters />
    </div>
  );
}

export default App;
