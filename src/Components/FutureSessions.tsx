import React, { useState } from "react";
import UnscheduledSession from "./UnscheduledSession";
import ScheduledSession from "./ScheduledSession";

const FutureSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  let scheduledSessions = sessions.filter((session) => {
    const sessionDate = new Date(session["scheduled-date"]).setHours(
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
    const isUnscheduled = session["scheduled-date"] === undefined;

    return isUnscheduled;
  });

  console.log("scheduled:", scheduledSessions);
  console.log("unscheduled:", unscheduledSessions);

  return (
    <div className="sessions-container">
      <h2>{`Future Sessions (${
        scheduledSessions.length + unscheduledSessions.length
      })`}</h2>
      <div className="session-columns-container" style={{ display: "flex" }}>
        <div className="scheduled-sessions-container" style={{ width: "100%" }}>
          <h3>Scheduled Sessions</h3>
          {scheduledSessions.map((session, key) => {
            return <UnscheduledSession key={key} session={session} />;
          })}
        </div>
        <div className="scheduled-sessions-container" style={{ width: "100%" }}>
          <h3>Unscheduled Sessions</h3>
          {unscheduledSessions.map((session, key) => {
            return <UnscheduledSession key={key} session={session} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default FutureSessions;
