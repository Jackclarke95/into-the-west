import React, { useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import Session from "./Session";

const PastSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  let pastSessions = sessions.filter((session) => {
    const sessionDate = new Date(session["scheduled-date"]).setHours(
      0,
      0,
      0,
      0
    );
    const today = new Date().setHours(0, 0, 0, 0);
    const inFuture = sessionDate < today;

    return inFuture;
  });

  return (
    <div className="sessions-container">
      <h2>{`Past Sessions (${pastSessions.length})`}</h2>
      {pastSessions.map((session, key) => {
        return <Session key={key} session={session} />;
      })}
    </div>
  );
};

export default PastSessions;
