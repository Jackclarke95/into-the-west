import React, { useState } from "react";

const Session = ({ session }) => {
  return (
    <div className="session" style={{ display: "flex" }}>
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        {session.name}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        Date: {session["scheduled-date"] ?? "N/A"}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        DM: {session["dungeon-master"] ?? "N/A"}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        Players:{" "}
        {session.players
          ? session.players.join(", ")
          : session.characters
          ? session.characters.join(", ")
          : "N/A"}
      </div>
    </div>
  );
};

export default Session;
