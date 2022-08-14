import React from "react";
import { Session } from "../Types/LocalStructures";
import Card from "./Surfaces/Card";

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <Card>
      <div className="session-card">
        <h3 className="title">{session.name}</h3>
        <div className="dungeon-master">
          <div className="label">Dungeon Master:</div>
          <div className="content">{session.dungeonMaster?.name}</div>
        </div>
      </div>
    </Card>
  );
};

export default SessionCard;
