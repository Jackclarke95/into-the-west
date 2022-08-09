import React from "react";
import { Session } from "../Types/LocalStructures";
import Card from "./Surfaces/Card";
import "./SessionCard.scss";

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <Card>
      <div className="session-card">
        <div className="title">{session.name}</div>
        <div className="dungeon-master">
          <div className="label">Dungeon Master:</div>
          <div className="content">{session.dungeonMaster?.name}</div>
        </div>
      </div>
    </Card>
  );
};

export default SessionCard;
