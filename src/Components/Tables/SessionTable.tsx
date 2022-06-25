import { useDispatch, useSelector } from "react-redux";
import {
  DirectionalHint,
  Facepile,
  FontSizes,
  IColumn,
  IconButton,
  IContextualMenuProps,
  IFacepilePersona,
  IIconProps,
  PersonaSize,
  SelectionMode,
  Separator,
  ShimmeredDetailsList,
  Stack,
  TooltipHost,
} from "@fluentui/react";
import ISessionData from "../../Interfaces/ISessionData";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import { toast } from "react-toastify";
import ISession from "../../Interfaces/ISession";
const SessionTable = () => {
  const dispatch = useDispatch();

  const sessionData = useSelector((state) => state.sessions);
  const playerData = useSelector((state) => state.users);
  const characterData = useSelector((state) => state.characters);
  const activeCharacter = useSelector((state) => state.activeCharacter);

  let upcomingSessions = [] as ISession[];
  let pastSessions = [] as ISession[];

  if (!sessionData.isLoading) {
    upcomingSessions = sessionData.data.filter(
      (session) =>
        !session.date || !DataHelper.isDateInPast(new Date(session.date))
    );

    pastSessions = sessionData.data.filter(
      (session) => session.date && new Date(session.date) <= new Date()
    );
  }

  const onRenderDate = (session: ISessionData) => (
    <span>
      {session.date ? new Date(session.date).toDateString() : "Unscheduled"}
    </span>
  );

  const onRenderName = (session: ISessionData) => <span>{session.name}</span>;

  const onRenderDungeonMaster = (session: ISessionData) => {
    if (playerData.isLoading) {
      return;
    }

    const matchedDm = playerData.data.find(
      (player) => player.dndBeyondName === session.dungeonMaster
    );

    if (matchedDm) {
      return <span>{matchedDm.name}</span>;
    } else {
      return <span>{session.dungeonMaster}</span>;
    }
  };

  const onRenderAttendees = (session: ISessionData) => {
    if (characterData.isLoading) {
      return;
    }

    const attendeeNames = [] as string[];

    const personas = session.attendees
      .map((attendee) => {
        const matchedCharacter = characterData.data.find(
          (character) => character.key === attendee
        );

        if (matchedCharacter) {
          attendeeNames.push(
            matchedCharacter!.nickname ?? matchedCharacter!.name
          );
        }

        return {
          imageUrl: matchedCharacter?.avatarUrl,
          personaName: matchedCharacter?.name,
        } as IFacepilePersona;
      })
      .sort((personaA, personaB) => {
        if (!personaA.personaName || !personaB.personaName) {
          return 0;
        } else {
          return personaA.personaName!.localeCompare(personaB.personaName!);
        }
      });

    return (
      <TooltipHost
        content={attendeeNames.sort().join(", ")}
        directionalHint={DirectionalHint.leftCenter}
      >
        <Facepile
          personas={personas}
          personaSize={PersonaSize.size16}
          maxDisplayablePersonas={personas.length}
        />
      </TooltipHost>
    );
  };

  const onClickSignUp = (session: ISession) => {
    if (activeCharacter.isLoading || !activeCharacter.data) {
      return;
    }

    console.log("clicked sign up");

    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: true, session: session },
    });

    // DataService.signUpToSession(session, activeCharacter.data);

    // toast.success("Signed up for session");
  };

  const onClickRemoveFromSession = (session: ISession) => {
    if (activeCharacter.isLoading || !activeCharacter.data) {
      return;
    }

    DataService.removeCharacterFromSession(session, activeCharacter.data);

    toast.success("Removed from session");
  };

  const onRenderSignUp = (session: ISession) => {
    if (!session || activeCharacter.isLoading || !activeCharacter.data) {
      return null;
    }

    const onClickManageSession = () => {
      dispatch({
        type: "SetSessionManagement",
        sessionManagement: { isShown: true, session: session },
      });
    };

    const settingsIcon: IIconProps = {
      iconName: "settings",
    };
    const sessionManagementIcon: IIconProps = {
      iconName: "WorkforceManagement",
    };

    const menuProps: IContextualMenuProps = {
      items: [
        session.attendees.includes(activeCharacter.data.key)
          ? {
              key: "Register",
              text: "Unregister",
              iconProps: { iconName: "USerRemove" },
              onClick: () => onClickRemoveFromSession(session),
            }
          : {
              key: "Register",
              text: "Register",
              iconProps: { iconName: "AddFriend" },
              onClick: () => onClickSignUp(session),
            },
        {
          key: "calendarEvent",
          text: "Volunteer as DM",
          iconProps: { iconName: "WorkforceManagement" },
        },
      ],
      directionalHintFixed: true,
    };

    return (
      <Stack
        className="icon-button-container"
        horizontal
        styles={{ root: { margin: -6 } }}
      >
        {DataHelper.isDateInPast(session.date!) ? (
          <Stack styles={{ root: { width: 52 } }}></Stack>
        ) : (
          <TooltipHost content="Register">
            <IconButton
              menuProps={menuProps}
              iconProps={sessionManagementIcon}
              disabled={false}
            />
          </TooltipHost>
        )}
        <TooltipHost content="Manage session">
          <IconButton
            iconProps={settingsIcon}
            disabled={false}
            onClick={onClickManageSession}
          />
        </TooltipHost>
      </Stack>
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
      minWidth: 120,
      onRender: onRenderAttendees,
    },
    {
      key: "sign-up",
      name: "",
      fieldName: "signUpUrl",
      minWidth: 75,
      onRender: onRenderSignUp,
    },
  ];

  return (
    <Stack styles={{ root: { maxHeight: "50%" } }}>
      <Separator
        styles={{
          root: {
            fontSize: FontSizes.xLargePlus,
          },
        }}
      >
        Sessions
      </Separator>
      <Stack styles={{ root: { overflowY: "auto" } }}>
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
                    name: "Upcoming sessions",
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
