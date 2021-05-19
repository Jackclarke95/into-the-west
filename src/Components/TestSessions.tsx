import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";
import { determineSessionCharacters } from "../Helpers/DataHelper";

const TestSessions = ({ characters, sessions }) => {
  var [showForm, setShowForm] = useState(false);
  var [currentSession, setCurrentSession] = useState({});

  const addSession = (session) => {
    firebaseDb.child("sessions").push(session);
  };

  const updateSession = (key, session) => {
    firebaseDb.child(`sessions/${key}`).update(session);
  };

  const deleteSession = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`sessions/${id}`).remove();
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const addNewSession = () => {
    console.log(currentSession);
  };

  return (
    <>
      <h2>Sessions</h2>
      <button onClick={() => toggleForm()}>
        {`${showForm ? "Hide" : "Show"} New Session Form`}
      </button>
      <form style={{ display: showForm ? "block" : "none" }}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          DM:
          <input type="text" name="dm" />
        </label>
        <label>
          Date:
          <input type="date" name="date" />
        </label>
        <label>
          Players:
          <select>
            <option></option>
            {Object.keys(characters).map((key) => {
              let character = characters[key];
              let name = character.nickname ?? character.name;
              return (
                <option key={key} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </label>
        <button onClick={() => addNewSession()}>Submit</button>
      </form>
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
                <td>
                  <button
                    onClick={() => {
                      deleteSession(key);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TestSessions;
