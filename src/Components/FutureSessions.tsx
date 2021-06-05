import React, { useState } from "react";
import SessionForm from "./SessionForm";
import SessionCard from "./SessionCard";

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
      <h3>Future Sessions (Work in Progress)</h3>
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
          <h3>Scheduled</h3>
          {scheduledSessions.map((session, key) => {
            return (
              <SessionCard
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
          <h3>Unscheduled</h3>
          {unscheduledSessions.map((session, key) => {
            return (
              <SessionCard
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
