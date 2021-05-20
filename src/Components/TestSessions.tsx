import React, { useState, useEffect } from "react";
import { Webhook, MessageBuilder } from "discord-webhook-node";
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

  const sendDiscordMessage = (session) => {
    const hook = new Webhook(
      "https://discord.com/api/webhooks/845060074015555605/T7uXBkLL8PYI4jgKc-yZU99tIem99BYN8OYo21qY4sLqeZEvChzG3wHMYlAOIB3Do7WE"
    );

    const embed = new MessageBuilder()
      .setAuthor("Adventure Announcer")
      .setTitle(
        session["suggested-by"]
          ? `${session["suggested-by"]} has suggested a new adventure!`
          : "A new adventure has been suggested!"
      )
      .setDescription(session.name)
      .addField("Dungeon Master", session["dungeon-master"] ?? "N/A")
      .setFooter("Please see the website for more details")
      .setTimestamp();

    hook.send(embed);
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
                  <button onClick={() => sendDiscordMessage(session)}>
                    Send To Discord
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
