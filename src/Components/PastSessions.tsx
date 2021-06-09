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

  // Sort by date
  pastSessions.sort((sessionA, sessionB) => {
    const dateA = new Date(sessionA.value["scheduled-date"]);
    const dateB = new Date(sessionB.value["scheduled-date"]);

    return dateA.getTime() - dateB.getTime();
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
            <th>#</th>
            <th
              style={{
                textAlign: "left",
                paddingLeft: "0.5em",
                paddingRight: "0.5em",
              }}
            >
              Title
            </th>
            <th>Dungeon Master</th>
            <th>Scheduled Date</th>
            <th
              style={{
                textAlign: "left",
                paddingLeft: "0.5em",
                paddingRight: "0.5em",
              }}
            >
              Players
            </th>
            <th></th>
          </tr>
        </thead>
        {pastSessions.map((session, key) => {
          let sessionData = session.value;

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
                  padding: "0.3em",
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
                  padding: "0.3em",
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
                  padding: "0.3em",
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
                  padding: "0.3em",
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
                  padding: "0.3em",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  {determineSessionCharacters(characters, sessionData)}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
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
                          title="Cancel"
                          className="material-icons"
                          style={{ color: "grey", cursor: "pointer" }}
                          onClick={() => {
                            setEditLegendKeeper(false);
                          }}
                        >
                          close
                        </span>
                        <span
                          title="Save LegendKeeper Link"
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
                        title="Edit LegendKeeper Link"
                        className="material-icons"
                        style={{
                          color: "grey",
                          cursor: "pointer",
                          fontSize: "1em",
                        }}
                        onClick={() => {
                          setEditLegendKeeper(true);
                        }}
                      >
                        edit
                      </span>
                    )
                  ) : (
                    <>
                      <span
                        title="Edit LegendKeeper Link"
                        className="material-icons"
                        style={{
                          color: "grey",
                          cursor: "pointer",
                          fontSize: "1em",
                          marginRight: "0.2em",
                        }}
                        onClick={() => {
                          setEditLegendKeeper(true);
                        }}
                      >
                        edit
                      </span>
                      <a
                        title="Open Session Log in LegendKeeper"
                        href={sessionData["legendkeeper-link"]}
                        target="blank"
                      >
                        <span
                          className="material-icons"
                          style={{ color: "grey" }}
                        >
                          menu_book
                        </span>
                      </a>
                    </>
                  )}
                </div>
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
