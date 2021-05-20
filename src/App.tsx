import React, { useState, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import Character from "./Components/CharacterCard.";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import {
  auth,
  firebaseDb,
  firestore,
  signInWithGoogleRedirect,
  signInWithGooglePopup,
} from "./firebase.utils";
import "./App.scss";

function App() {
  const [characters, setCharacters] = useState([] as {}[]);
  const [sessions, setSessions] = useState([] as {}[]);
  const [user, setUser] = useState({} as any);
  const [currentPlayer, setCurrentPlayer] = useState();

  const sendDiscordMessage = () => {
    let imageUrl;

    firestore
      .ref(`Avatars/Eslyn Juhlenath.jpeg`)
      .getDownloadURL()
      .then((url) => {
        console.log("test");
        console.log(url);
        imageUrl = url;
      })
      .catch((e) => {
        console.log("borked");
        imageUrl =
          "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
      });

    console.log(imageUrl);

    const hook = new Webhook(
      "https://discord.com/api/webhooks/845060074015555605/T7uXBkLL8PYI4jgKc-yZU99tIem99BYN8OYo21qY4sLqeZEvChzG3wHMYlAOIB3Do7WE"
    );

    const embed = new MessageBuilder()
      .setThumbnail(imageUrl)
      .setImage(imageUrl)
      .setTitle("Eslyn has suggested a new adventure!")
      .setDescription("Hunt for the Thessalhydra")
      .setFooter("Please see the website for more details")
      .addField("field1", "field1 desc")
      //.setColor(255255255)
      .addField("field2", "field2 desc")
      .setAuthor("Adventure Announcer")
      .setTimestamp();

    let foo = hook.send(embed);

    console.log("foo", foo);

    // var request = new XMLHttpRequest();

    // request.open(
    //   "POST",
    //   "https://discord.com/api/webhooks/845060074015555605/T7uXBkLL8PYI4jgKc-yZU99tIem99BYN8OYo21qY4sLqeZEvChzG3wHMYlAOIB3Do7WE"
    // );

    // var params = {
    //   username: "Spidey Bot",
    //   avatar_url: "",
    //   content: "test message",
    // };

    // console.log("Sending message", `${params.username}; "${params.content}"`);

    // request.send(JSON.stringify(params));
  };

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  useEffect(() => {
    let sessionArray = [] as {}[];
    firebaseDb
      .child("sessions")
      .orderByChild("scheduled-date")
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
          sessionArray.push(child.val());
        });
        setSessions(sessionArray);
      });

    let characterArray = [] as {}[];

    firebaseDb
      .child("characters")
      .orderByChild("name")
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          characterArray.push(child.val());
        });
        setCharacters(characterArray);
      });
  }, []);

  if (user && user.uid && !currentPlayer) {
    firebaseDb
      .child("players")
      .orderByChild("uid")
      .equalTo(user.uid)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          setCurrentPlayer({ ...snapshot.val() });
        }
      });
  }

  return (
    <div>
      {user ? (
        <button onClick={() => auth.signOut()}>Sign Out</button>
      ) : (
        <>
          <BrowserView>
            <button onClick={signInWithGooglePopup}>Sign In with Google</button>
          </BrowserView>
          <MobileView>
            <button onClick={signInWithGoogleRedirect}>
              Sign In with Google
            </button>
          </MobileView>
        </>
      )}
      <button onClick={sendDiscordMessage}>Send Discord Message</button>
      <h1>Into The West</h1>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {Object.keys(characters).map((key) => (
            <Character
              key={key}
              character={characters[key]}
              characterKey={key}
              sessions={sessions}
              player={currentPlayer}
            />
          ))}
        </div>
      </div>
      <TestEncounters />
      <TestSessions characters={characters} sessions={sessions} />
    </div>
  );
}

export default App;
