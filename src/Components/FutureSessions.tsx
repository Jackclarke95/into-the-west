import React, { useState } from "react";
import Session from "./Session";

const FutureSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  let futureSessions = sessions.filter((session) => {
    const sessionDate = new Date(session["scheduled-date"]).setHours(
      0,
      0,
      0,
      0
    );
    const today = new Date().setHours(0, 0, 0, 0);
    const inFuture =
      sessionDate >= today || session["scheduled-date"] === undefined;

    return inFuture;
  });

  return (
    <div className="sessions-container">
      <h2>{`Future Sessions (${futureSessions.length})`}</h2>
      {futureSessions.map((session, key) => {
        return <Session key={key} session={session} />;
      })}
    </div>
  );
};

export default FutureSessions;
