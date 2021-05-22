import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";
import { determineSessionCharacters } from "../Helpers/DataHelper";
import SessionForm from "./SessionForm";

const TestSessions = ({
  characters,
  sessions,
  player = null as null | any,
}) => {
  var [showForm, setShowForm] = useState(true);
  var [currentSession, setCurrentSession] = useState({});

  const addSession = (session) => {
    firebaseDb.child("sessions").push(session);
  };

  const updateSession = (key, session) => {
    firebaseDb.child(`sessions/${key}`).update(true);
  };

  const deleteSession = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`sessions/${id}`).remove();
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  let playerName = "";

  if (player) {
    let playerData;
    Object.keys(player).map((key) => {
      playerData = player[key];
    });

    playerName = playerData["dndbeyond-name"];
  }

  return (
    <>
      <h2>Sessions</h2>
      <button onClick={() => toggleForm()}>
        {showForm ? "Hide Form" : "Suggest Adventure"}
      </button>
      {player && showForm ? <SessionForm playerName={playerName} /> : null}
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Dungeon Master</th>
            <th>Suggested Date</th>
            <th>Scheduled Date</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sessions).map((key, i) => {
            let session = sessions[key];
            return (
              <tr
                style={{
                  backgroundColor: i % 2 !== 0 ? "lightgrey" : "white",
                }}
                key={key}
                data-id={session.id}
              >
                <td>{session.name}</td>
                <td>
                  {session["dungeon-master"]
                    ? session["dungeon-master"]
                    : "None yet"}
                </td>
                <td>
                  {session["suggested-date"]
                    ? session["suggested-date"]
                    : "N/A"}
                </td>
                <td>
                  {session["scheduled-date"]
                    ? session["scheduled-date"]
                    : "N/A"}
                </td>
                <td>{determineSessionCharacters(characters, session)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TestSessions;
