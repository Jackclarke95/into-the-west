import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IColumn,
  PrimaryButton,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  Toggle,
} from "@fluentui/react";
import ISessionData from "../Interfaces/ISessionData";
import DataHelper from "../Helpers/DataHelper";

export default () => {
  const dispatch = useDispatch();

  const sessionData = useSelector((state) => state.sessions);
  const playerData = useSelector((state) => state.players);
  const [compactMode, setCompactMode] = React.useState(false);

  let upcomingSessions = [] as ISessionData[];
  let pastSessions = [] as ISessionData[];

  if (!sessionData.isLoading) {
    upcomingSessions = sessionData.data.filter((session) =>
      DataHelper.isSessionInPast(session)
    );

    pastSessions = sessionData.data.filter(
      (session) => new Date(session.date) <= new Date()
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

  const onClickCreateSession = () => {
    console.log("creating session");

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

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
            paddingTop: "1em",
            paddingBottom: "1em",
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
        <PrimaryButton text="New session" onClick={onClickCreateSession} />
      </Stack>
      <Stack
        className="session-table-container"
        grow={1}
        styles={{
          root: {
            overflowY: "scroll",
            overflowX: "auto",
            flexGrow: 1,
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
