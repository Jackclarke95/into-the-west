import React, { useState } from "react";
import { determineSessionCharacters } from "../Helpers/DataHelper";

const PastSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  let pastSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.value["scheduled-date"]).setHours(
      0,
      0,
      0,
      0
    );
    const today = new Date().setHours(0, 0, 0, 0);
    const inFuture = sessionDate < today;

    return inFuture;
  });

  pastSessions.sort((sessionA, sessionB) => {
    return sessionA.value["scheduledDate"] < sessionB.value["scheduledDate"];
  });

  let sessionArray = [] as any[];

  pastSessions.forEach((session) => {
    sessionArray.push(session.value);
  });

  return sessions.length > 0 ? (
    <div className="past-sessions-container">
      <h2>{`Past Sessions (${sessionArray.length})`}</h2>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th></th>
            <th style={{ textAlign: "left" }}>Title</th>
            <th>Dungeon Master</th>
            <th>Scheduled Date</th>
            <th style={{ textAlign: "left" }}>Players</th>
          </tr>
        </thead>
        {sessionArray.map((session, key) => {
          return (
            <tr
              key={key}
              data-id={session.id}
              style={{
                backgroundColor: key % 2 !== 0 ? "lightgrey" : "white",
                height: "2em",
              }}
            >
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {key + 1}
              </td>
              <td
                title={session.name}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {session.name}
              </td>
              <td
                title={
                  session["dungeon-master"]
                    ? session["dungeon-master"]
                    : "None yet"
                }
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {session["dungeon-master"]
                  ? session["dungeon-master"]
                  : "None yet"}
              </td>
              <td
                title={
                  session["scheduled-date"] ? session["scheduled-date"] : "N/A"
                }
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {session["scheduled-date"] ? session["scheduled-date"] : "N/A"}
              </td>
              <td
                title={determineSessionCharacters(characters, session)}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {determineSessionCharacters(characters, session)}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default PastSessions;
