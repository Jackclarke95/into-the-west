import React, { useState } from "react";
import FutureSessionCard from "./FutureSessionCard.";

const FutureSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  let scheduledSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.value["scheduled-date"]).setHours(
      0,
      0,
      0,
      0
    );
    const today = new Date().setHours(0, 0, 0, 0);
    const inFuture = sessionDate >= today;

    return inFuture;
  });

  let unscheduledSessions = sessions.filter((session) => {
    const isUnscheduled = session.value["scheduled-date"] === undefined;

    return isUnscheduled;
  });

  return (
    <div className="future-sessions-container">
      <h2>{`Future Sessions (${
        scheduledSessions.length + unscheduledSessions.length
      })`}</h2>
      <div
        className="session-columns-container"
        style={{
          display: "flex",
          padding: "0.5em",
        }}
      >
        <div
          className="scheduled-sessions-container"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "1em",
            margin: "0.5em",
          }}
        >
          <h3>{`Scheduled (${scheduledSessions.length})`}</h3>
          {scheduledSessions.map((session, key) => {
            return (
              <FutureSessionCard
                key={key}
                characters={characters}
                currentPlayer={currentPlayer}
                players={players}
                session={session.value}
                sessionKey={session.key}
              />
            );
          })}
        </div>
        <div
          className="scheduled-sessions-container"
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: "1em",
            margin: "0.5em",
          }}
        >
          <h3>{`Unscheduled (${unscheduledSessions.length})`}</h3>
          {unscheduledSessions.map((session, key) => {
            return (
              <FutureSessionCard
                key={key}
                characters={characters}
                currentPlayer={currentPlayer}
                players={players}
                session={session.value}
                sessionKey={session.key}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FutureSessions;
