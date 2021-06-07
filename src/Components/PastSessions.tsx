import React, { useState } from "react";
import { determineSessionCharacters } from "../Helpers/DataHelper";
import { firebaseDb } from "../firebase.utils";

const PastSessions = ({
  sessions,
  characters,
  players,
  currentPlayer = null as any | null,
}) => {
  const [editLegendKeeper, setEditLegendKeeper] = useState(false);
  const [legendKeeperLink, setLegendKeeperLink] = useState("");

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

  const updateLegendKeeperLink = (sessionKey, session) => {
    if (legendKeeperLink.length > 0) {
      session["legendkeeper-link"] = legendKeeperLink;
    }

    firebaseDb
      .child(`sessions/${sessionKey}`)
      .update(session)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to sign up for session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  console.log(sessions);

  return sessions.length > 0 ? (
    <div className="past-sessions-container">
      <h2>Past Sessions</h2>
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
            <th></th>
          </tr>
        </thead>
        {pastSessions.map((session, key) => {
          let sessionData = session.value;
          console.log();

          return (
            <tr
              key={key}
              data-id={sessionData.id}
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
                title={sessionData.name}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {sessionData.name}
              </td>
              <td
                title={
                  sessionData["dungeon-master"]
                    ? sessionData["dungeon-master"]
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
                {sessionData["dungeon-master"]
                  ? sessionData["dungeon-master"]
                  : "None yet"}
              </td>
              <td
                title={
                  sessionData["scheduled-date"]
                    ? new Date(
                        sessionData["scheduled-date"]
                      ).toLocaleDateString("en-UK", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"
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
                {sessionData["scheduled-date"]
                  ? new Date(sessionData["scheduled-date"]).toLocaleDateString(
                      "en-UK",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </td>
              <td
                title={determineSessionCharacters(characters, sessionData)}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                }}
              >
                {determineSessionCharacters(characters, sessionData)}
              </td>
              <td
                style={{
                  // width: "10em",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {sessionData["legendkeeper-link"] === undefined ||
                !sessionData["legendkeeper-link"] ||
                sessionData["legendkeeper-link"].length === 0 ? (
                  editLegendKeeper ? (
                    <>
                      <input
                        type="text"
                        value={legendKeeperLink}
                        placeholder="LegendKeeper URL"
                        onChange={(e) => {
                          setLegendKeeperLink(e.target.value);
                        }}
                      />
                      <span
                        className="material-icons"
                        style={{ color: "grey", cursor: "pointer" }}
                        onClick={() => {
                          updateLegendKeeperLink(session.key, sessionData);
                        }}
                      >
                        save
                      </span>
                    </>
                  ) : (
                    <span
                      className="material-icons"
                      style={{ color: "grey", cursor: "pointer" }}
                      onClick={() => {
                        console.log("clicked set");
                        setEditLegendKeeper(true);
                      }}
                    >
                      edit
                    </span>
                  )
                ) : (
                  <a
                    title="Open Session Log in LegendKeeper"
                    href={sessionData["legendkeeper-link"]}
                    target="blank"
                  >
                    <span className="material-icons" style={{ color: "grey" }}>
                      menu_book
                    </span>
                  </a>
                )}
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
