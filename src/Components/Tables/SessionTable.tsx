import { useSelector } from "react-redux";
import {
  Facepile,
  FontSizes,
  IColumn,
  IFacepilePersona,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
} from "@fluentui/react";
import ISessionData from "../../Interfaces/ISessionData";
import DataHelper from "../../Helpers/DataHelper";

const SessionTable = () => {
  const sessionData = useSelector((state) => state.sessions);
  const playerData = useSelector((state) => state.players);
  const characterData = useSelector((state) => state.characters);

  let upcomingSessions = [] as ISessionData[];
  let pastSessions = [] as ISessionData[];

  if (!sessionData.isLoading) {
    upcomingSessions = sessionData.data.filter(
      (session) => !DataHelper.isDateInPast(new Date(session.date))
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

  const onRenderAttendees = (session: ISessionData) => {
    if (characterData.isLoading) {
      return;
    }

    const personas = session.attendees
      .map((attendee) => {
        const matchedCharacter = characterData.data.find(
          (character) => character.id === attendee
        );

        return {
          imageUrl: matchedCharacter?.avatarUrl,
          personaName: matchedCharacter?.name,
        } as IFacepilePersona;
      })
      .sort((a, b) => a.personaName!.localeCompare(b.personaName!));

    return (
      <Facepile
        personas={personas}
        personaSize={PersonaSize.size16}
        maxDisplayablePersonas={personas.length}
      />
    );
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
      name: "DM",
      fieldName: "dungeonMaster",
      minWidth: 75,
      isResizable: true,
      onRender: onRenderDungeonMaster,
    },
    {
      key: "map",
      name: "Map",
      fieldName: "map",
      minWidth: 150,
    },
    {
      key: "characters",
      name: "Characters",
      fieldName: "attendees",
      minWidth: 150,
      onRender: onRenderAttendees,
    },
  ];

  return (
    <Stack styles={{ root: { overflowY: "auto" } }}>
      <Stack
        grow={1}
        styles={{
          root: {
            overflowY: "scroll",
            overflowX: "auto",
            flexGrow: 1,
          },
        }}
      >
        <Text
          styles={{
            root: { fontSize: FontSizes.xLargePlus, textAlign: "start" },
          }}
        >
          Sessions
        </Text>
        <ShimmeredDetailsList
          items={sessionData.isLoading ? [] : sessionData.data}
          columns={columns}
          enableShimmer={sessionData.isLoading}
          selectionMode={SelectionMode.none}
          compact
          groups={
            upcomingSessions.length === 0
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

export default SessionTable;
