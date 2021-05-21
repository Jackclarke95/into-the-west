import React, { useState } from "react";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import { firebaseDb } from "../firebase.utils";

const SessionForm = (playerName = null as null | any) => {
  const [name, setName] = useState("");
  const [dungeonMaster, setDungeonMaster] = useState(null as null | string);

  playerName = playerName["playerName"] ?? null;

  const createSession = () => {
    const dateNow = new Date();
    const currentDate = `${dateNow.getFullYear()} ${
      dateNow.getMonth() + 1
    } ${dateNow.getDate()}`;

    const session = {
      "dungeon-master": dungeonMaster ?? "N/A",
      name: name,
      "suggested-by": playerName,
      characters: [0, 0, 0, 0, 0],
      "scheduled-date": "",
      "suggested-date": currentDate,
    };

    addSession(session);
    sendDiscordMessage(session);
  };

  const sendDiscordMessage = (session) => {
    const hook = new Webhook(
      "https://discord.com/api/webhooks/845060074015555605/T7uXBkLL8PYI4jgKc-yZU99tIem99BYN8OYo21qY4sLqeZEvChzG3wHMYlAOIB3Do7WE"
    );

    const message = new MessageBuilder()
      .setAuthor("Westeridge Town Crier")
      .setTitle(
        session["suggested-by"]
          ? `${session["suggested-by"]} has suggested a new adventure!`
          : "A new adventure has been suggested!"
      )
      .setDescription(session.name)
      .addField("Dungeon Master", session["dungeon-master"] ?? "N/A")
      .setFooter("Please see the website for more details")
      .setTimestamp();

    console.log("session", session);
    console.log("suggested by", session["suggested-by"]);

    hook.send(message);
  };

  const addSession = (session) => {
    firebaseDb.child("sessions").push(session);
  };

  return (
    <div>
      <h3>New Session</h3>
      <input
        type="text"
        value={name}
        placeholder="Enter a message"
        onChange={(e) => setName(e.target.value)}
      />

      <div>Dungeon Master</div>
      <div>
        <select onChange={(e) => setDungeonMaster(e.target.value)}>
          <option value=""></option>
          <option value="Jack">Jack</option>
          <option value="Louis">Louis</option>
          <option value="Dave">Dave</option>
          <option value="Ben">Ben</option>
        </select>
      </div>
      <button onClick={createSession}>Suggest Adventure!</button>
    </div>
  );
};

export default SessionForm;
