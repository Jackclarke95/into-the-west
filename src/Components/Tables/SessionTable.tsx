import { useSelector } from "react-redux";
import {
  Facepile,
  FontSizes,
  IColumn,
  IFacepilePersona,
  Link,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  TooltipHost,
} from "@fluentui/react";
import ISessionData from "../../Interfaces/ISessionData";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import { toast } from "react-toastify";

const SessionTable = () => {
  const sessionData = useSelector((state) => state.sessions);
  const playerData = useSelector((state) => state.players);
  const characterData = useSelector((state) => state.characters);
  const activeCharacter = useSelector((state) => state.activeCharacter);

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

  const onClickSignUp = (session: ISessionData) => {
    if (activeCharacter.isLoading || !activeCharacter.data) {
      return;
    }

    DataService.signUpToSession(session, activeCharacter.data);

    toast("Signed up for session");
  };

  const onClickRemoveFromSession = (session: ISessionData) => {
    if (activeCharacter.isLoading || !activeCharacter.data) {
      return;
    }

    DataService.removeCharacterFromSession(session, activeCharacter.data);

    toast("Removed from session");
  };

  const onRenderSignUp = (session: ISessionData) => {
    if (
      activeCharacter.isLoading ||
      !activeCharacter.data ||
      DataHelper.isDateInPast(new Date(session.date))
    ) {
      return null;
    }

    return session.attendees.includes(activeCharacter.data.id) ? (
      <TooltipHost content="Click to remove yourself from this session">
        <Link
          iconName="UserRemove"
          onClick={() => onClickRemoveFromSession(session)}
        >
          Remove
        </Link>
      </TooltipHost>
    ) : (
      <TooltipHost content="Click to sign up to this session">
        <Link onClick={() => onClickSignUp(session)}>Sign Up</Link>
      </TooltipHost>
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
    {
      key: "sign-up",
      name: "",
      fieldName: "signUpUrl",
      minWidth: 45,
      onRender: onRenderSignUp,
    },
  ];

  return (
    <Stack styles={{ root: { overflowY: "auto", height: "50%" } }}>
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
  );
};

export default SessionTable;
