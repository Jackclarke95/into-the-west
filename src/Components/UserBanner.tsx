import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { MdArrowDropDown, MdFileUpload } from "react-icons/md";
import {
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOut,
  firebaseDb,
} from "../firebase.utils";

const UserBanner = ({
  user = null as any | null,
  currentPlayer = null as any | null,
}) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [displayName, setDisplayName] = useState("" as string | null);
  const [discordName, setDiscordName] = useState("" as string | null);
  const [player, setPlayer] = useState({} as any);
  const [playerKey, setPlayerKey] = useState("" as string | null);
  const [dataChanged, setDataChanged] = useState(false);

  if (
    currentPlayer &&
    (displayName === "" || discordName === "") &&
    !dataChanged
  ) {
    firebaseDb
      .child("players")
      .orderByChild("dndbeyond-name")
      .equalTo(currentPlayer["dndbeyond-name"])
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
          setPlayer(child.val());
          setPlayerKey(child.key);
          setDisplayName(child.val()["display-name"]);
          setDiscordName(child.val()["discord-name"]);
        });
      });
  }

  const updateNames = () => {
    updateDisplayName();
    updateDiscordName();

    window.location.reload();
  };

  const updateDisplayName = () => {
    player["display-name"] = displayName === "" ? null : displayName;

    firebaseDb
      .child(`players/${playerKey}`)
      .update(player)

      .catch((e) =>
        alert(
          `Unable to update User. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  const updateDiscordName = () => {
    player["discord-name"] = discordName === "" ? null : discordName;

    firebaseDb
      .child(`players/${playerKey}`)
      .update(player)

      .catch((e) =>
        alert(
          `Unable to update User. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  return (
    <div
      className="user-banner"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "0.5em",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      {user ? (
        <>
          <div>{`Welcome, ${user.displayName}`}</div>
          <MdArrowDropDown
            title="Account Settings"
            className="account-settings-button"
            size="1.5em"
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            style={{
              alignSelf: "center",
              marginLeft: "0.3em",
              marginRight: "0.3em",
              cursor: "pointer",
            }}
          />
          <img alt="Profile" src={user.photoURL} height="24px" width="24px" />
          {settingsExpanded ? (
            <div
              className="user-settings-menu"
              style={{
                position: "absolute",
                top: "2.5em",
                right: "0",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                padding: "0.5em",
              }}
            >
              <div
                onClick={() => {
                  signOut();
                  window.location.reload();
                }}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "1em",
                }}
              >
                <div className="sign-out-button" style={{ display: "flex" }}>
                  Sign Out
                  <MdFileUpload
                    size="1.5em"
                    style={{ transform: "rotate(90deg)", marginLeft: "0.5em" }}
                  />
                </div>
              </div>
              <div
                className="user-names-form"
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>Display Name</div>
                <input
                  type="text"
                  className="input-display-name"
                  placeholder="Display Name"
                  value={displayName ?? ""}
                  onChange={(e) => {
                    setDataChanged(true);
                    setDisplayName(e.target.value);
                  }}
                  onBlur={(e) => setDisplayName(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateNames();
                    }
                  }}
                  style={{ marginBottom: "0.5em" }}
                />
                <div>Discord Name</div>
                <input
                  type="text"
                  className="input-discord-name"
                  placeholder="Discord Name"
                  value={discordName ?? ""}
                  onChange={(e) => {
                    setDataChanged(true);
                    setDiscordName(e.target.value);
                  }}
                  onBlur={(e) => setDiscordName(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateNames();
                    }
                  }}
                  style={{ marginBottom: "0.5em" }}
                />
                <button
                  className="user-names-submit-button"
                  onClick={updateNames}
                  style={{ backgroundColor: "lightgreen" }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div style={{ marginRight: "0.5em" }}>
            Please sign in for more features
          </div>
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
    </div>
  );
};

export default UserBanner;
