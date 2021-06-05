import FutureSessions from "./FutureSessions";
import PastSessions from "./PastSessions";
import SessionForm from "./SessionForm";

const Sessions = ({
  sessions,
  characterData,
  players,
  currentPlayer = null as any | null,
}) => {
  return (
    <>
      <h2>Adventures</h2>
      <FutureSessions
        characters={characterData}
        sessions={sessions}
        players={players}
        currentPlayer={currentPlayer}
      />
      {currentPlayer ? (
        <SessionForm currentPlayer={currentPlayer} players={players} />
      ) : (
        <div>Sign in to suggest an adventure!</div>
      )}
      <PastSessions
        characters={characterData}
        sessions={sessions}
        players={players}
        currentPlayer={currentPlayer}
      />
    </>
  );
};

export default Sessions;
