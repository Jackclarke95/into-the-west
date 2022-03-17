import React from "react";
import {
  DefaultSpacing,
  DetailsListLayoutMode,
  IColumn,
  Image,
  ImageFit,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  Toggle,
} from "@fluentui/react";
import { Data } from "../Data/Data";
import { ClassIcon } from "./ClassIcon";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import { useSelector } from "react-redux";
import ISessionData from "../Interfaces/SessionData";

export const SessionTable = () => {
  const [compactMode, setCompactMode] = React.useState(false);

  const sessionData = Object.keys(Data.sessions)
    .map((key) => {
      return Data.sessions[key] as ISessionData;
    })
    .sort((sessionA, sessionB) => sessionB.date.localeCompare(sessionA.date));

  const upcomingSessions = sessionData.filter((session) => {
    console.log(
      session.name,
      new Date(session.date),
      new Date(session.date) > new Date()
    );

    return new Date(session.date) > new Date();
  });

  const pastSessions = sessionData.filter(
    (session) => new Date(session.date) < new Date()
  );

  const onRenderDate = (session: ISessionData) => (
    <span>{new Date(session.date).toDateString()}</span>
  );

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      isResizable: true,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 150,
      isResizable: true,
      onRender: onRenderDate,
    },
    {
      key: "dungeon-master",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: 175,
      isResizable: true,
    },
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 33,
      maxWidth: 50,
    },
  ];

  console.log(sessionData);

  return (
    <Stack
      className="sessions-container"
      styles={{ root: { overflow: "auto" } }}
    >
      <Stack
        horizontal
        className="session-table-header"
        styles={{
          root: {
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
          },
        }}
      >
        <Text variant="superLarge">Sessions</Text>
        <Toggle
          label="Compact Table"
          inlineLabel
          onText="Compact"
          offText="Normal"
          onChange={() => setCompactMode(!compactMode)}
        />
      </Stack>
      <Stack
        className="session-table-container"
        grow={1}
        styles={{
          root: {
            overflowY: "auto",
            flexGrow: 1,
          },
        }}
      >
        <ShimmeredDetailsList
          layoutMode={DetailsListLayoutMode.fixedColumns}
          items={sessionData}
          columns={columns}
          compact={compactMode}
          selectionMode={SelectionMode.none}
          groups={[
            {
              startIndex: 0,
              count: upcomingSessions.length,
              key: "upcoming",
              name: "Upcoming Sessions",
            },
            {
              startIndex: upcomingSessions.length,
              count: pastSessions.length,
              key: "Past",
              name: "Past Sessions",
            },
          ]}
        />
      </Stack>
    </Stack>
  );
};
