import { useDispatch, useSelector } from "react-redux";
import {
  DirectionalHint,
  Facepile,
  FontSizes,
  IButtonStyles,
  IColumn,
  IconButton,
  IFacepilePersona,
  IOverflowSetItemProps,
  Link,
  OverflowSet,
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
  const playerData = useSelector((state) => state.players);
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

    DataService.signUpToSession(session, activeCharacter.data);

    toast.success("Signed up for session");
  };

  const onClickRemoveFromSession = (session: ISession) => {
    if (activeCharacter.isLoading || !activeCharacter.data) {
      return;
    }

    DataService.removeCharacterFromSession(session, activeCharacter.data);

    toast.success("Removed from session");
  };

  const onRenderSignUp = (session: ISession) => {
    if (
      activeCharacter.isLoading ||
      !activeCharacter.data ||
      (session.date && DataHelper.isDateInPast(new Date(session.date)))
    ) {
      return null;
    }

    const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
      return (
        <Link
          role="menuitem"
          styles={{ root: { marginRight: 10 } }}
          onClick={item.onClick}
        >
          {item.name}
        </Link>
      );
    };

    const onRenderOverflowButton = (
      overflowItems: any[] | undefined
    ): JSX.Element => {
      const buttonStyles: Partial<IButtonStyles> = {
        root: {
          minWidth: 0,
          padding: "0 4px",
          alignSelf: "stretch",
          height: "auto",
        },
      };
      return (
        <IconButton
          role="menuitem"
          title="More options"
          styles={buttonStyles}
          menuIconProps={{ iconName: "More" }}
          menuProps={{ items: overflowItems! }}
        />
      );
    };

    const onClickManageSession = () => {
      dispatch({
        type: "SetShowSessionManagementDialog",
        showSessionManagementDialog: true,
      });
    };

    return (
      <OverflowSet
        onRenderItem={onRenderItem}
        onRenderOverflowButton={onRenderOverflowButton}
        items={[
          session.attendees.includes(activeCharacter.data.key)
            ? {
                key: "item5",
                name: "Remove",
                onClick: () => onClickRemoveFromSession(session),
              }
            : {
                key: "item4",
                name: "Sign Up",
                onClick: () => onClickSignUp(session),
              },
        ]}
        overflowItems={[
          {
            key: "item1",
            name: "Manage",
            onClick: onClickManageSession,
          },
        ]}
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
      minWidth: 100,
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
