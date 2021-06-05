import { useState } from "react";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import { firebaseDb } from "../firebase.utils";
import { getPlayerDisplayNameFromName } from "../Helpers/DataHelper";

const SessionForm = ({
  currentPlayer = null as null | any,
  players = null as null | any,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sessionDungeonMaster, setSessionDungeonMaster] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const createSession = () => {
    const dateNow = new Date();
    const currentDate = `${dateNow.getFullYear()} ${
      dateNow.getMonth() + 1
    } ${dateNow.getDate()}`;

    const session = {
      name: name,
      description: description,
      "suggested-by": currentPlayer["dndbeyond-name"],
      "suggested-date": currentDate,
    };

    if (sessionDungeonMaster.length > 0) {
      session["dungeon-master"] = sessionDungeonMaster;
    }

    if (scheduledDate.length > 0) {
      session["scheduled-date"] = scheduledDate;
    }

    console.log(session);
    addSession(session);
    sendDiscordMessage(session);
  };

  const addSession = (session) => {
    firebaseDb.child("sessions").push(session);
  };

  const sendDiscordMessage = (session) => {
    const hook = new Webhook(
      "https://discord.com/api/webhooks/845060074015555605/T7uXBkLL8PYI4jgKc-yZU99tIem99BYN8OYo21qY4sLqeZEvChzG3wHMYlAOIB3Do7WE"
    );

    const message = new MessageBuilder()
      .setAuthor("Westeridge Town Crier")
      .setTitle(session.name)
      .setDescription(session.description)
      .addField(
        "Suggested by",
        getPlayerDisplayNameFromName(session["suggested-by"], players)
      )
      .setFooter("Please see the website for more details")
      .setTimestamp();

    hook
      .send(message)
      .then(() => window.location.reload())
      .catch((e) =>
        alert(
          `Unable to create session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  let dungeonMasters = players
    .filter((player) => {
      return player["dungeon-master"];
    })
    .sort();

  return (
    <div className="new-session-form-container">
      <h3>New Session (Work in Progress)</h3>
      <div
        className="new-session-form"
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "1em",
          flexDirection: "row",
        }}
      >
        <div
          className="new-session-form-top"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            value={name}
            placeholder="Adventure Name"
            onChange={(e) => setName(e.target.value)}
          />
          <div>Date (Optional)</div>
          <input
            type="date"
            onChange={(e) =>
              setScheduledDate(e.target.value.replaceAll("-", " "))
            }
          />
          <div>Dungeon Master</div>
          <div>
            <select onChange={(e) => setSessionDungeonMaster(e.target.value)}>
              <option value=""></option>
              {dungeonMasters.map((dungeonMaster) => {
                return (
                  <option value={dungeonMaster["dndbeyond-name"]}>
                    {dungeonMaster["display-name"] ??
                      dungeonMaster["dndbeyond-name"]}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <textarea
          value={description}
          placeholder="Adventure Description"
          onChange={(e) => setDescription(e.target.value)}
          style={{ fontFamily: "sans-serif" }}
        />
        <button
          onClick={createSession}
          disabled={name.length === 0 || description.length === 0}
        >
          Suggest Adventure!
        </button>
      </div>
    </div>
  );
};

export default SessionForm;
