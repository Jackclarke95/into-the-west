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
import ISessionData from "../Interfaces/ISessionData";
import { useDispatch, useSelector } from "react-redux";

export const SessionTable = () => {
  const dispatch = useDispatch();

  const sessionData = useSelector((state) => state.sessions);
  const playerData = useSelector((state) => state.players);
  const [compactMode, setCompactMode] = React.useState(false);

  let upcomingSessions = [] as ISessionData[];
  let pastSessions = [] as ISessionData[];

  if (!sessionData.isLoading) {
    upcomingSessions = sessionData.data.filter(
      (session) => new Date(session.date) > new Date()
    );

    pastSessions = sessionData.data.filter(
      (session) => new Date(session.date) < new Date()
    );
  }

  const onRenderDate = (session: ISessionData) => (
    <span>{new Date(session.date).toDateString()}</span>
  );

  const onRenderName = (session: ISessionData) => (
    <span
      style={{
        display: "block",
        textAlign: "left",
        paddingLeft: sessionData.isLoading ? "36px" : "auto",
      }}
    >
      {session.name}
    </span>
  );

  const onRenderDungeonMaster = (session: ISessionData) => {
    console.log(playerData);
    if (playerData.isLoading) {
      return;
    }

    const matchedDm = playerData.data.find(
      (player) => player.dndBeyondName === session.dungeonMaster
    );

    if (matchedDm) {
      return <span>{matchedDm.friendlyName}</span>;
    } else {
      return <span>{session.dungeonMaster}</span>;
    }
  };

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      isResizable: true,
      onRender: onRenderName,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 100,
      isResizable: true,
      onRender: onRenderDate,
    },
    {
      key: "dungeon-master",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: 120,
      isResizable: true,
      onRender: onRenderDungeonMaster,
    },
    {
      key: "map",
      name: "Map",
      fieldName: "map",
      minWidth: 150,
    },
  ];

  return (
    <Stack
      className="sessions-container"
      styles={{ root: { overflowY: "auto" } }}
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
            overflowY: "scroll",
            overflowX: "auto",
            flexGrow: 1,
            width: "100%",
          },
        }}
      >
        <ShimmeredDetailsList
          items={sessionData.isLoading ? [] : sessionData.data}
          columns={columns}
          enableShimmer={sessionData.isLoading}
          selectionMode={SelectionMode.none}
          compact={compactMode}
          groups={
            sessionData.isLoading
              ? undefined
              : [
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
                ]
          }
        />
      </Stack>
    </Stack>
  );
};
