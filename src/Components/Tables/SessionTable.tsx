import {
  DirectionalHint,
  Facepile,
  IColumn,
  IconButton,
  IIconProps,
  OverflowButtonType,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  TooltipHost,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import { Character, Session } from "../../Types/LocalStructures";

const SessionTable = () => {
  const dispatch = useDispatch();

  const sessions = useSelector((state) => state.sessions);
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const sessionInterests = useSelector((state) => state.sessionInterests);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  const onRenderAttendees = (session: Session) => {
    let attendees: Character[] = [];

    if (session.date && DataHelper.isDateInPast(session.date)) {
      attendees = session.attendees.attending;
    } else {
      attendees = session.attendees.interested;
    }

    return (
      <TooltipHost
        content={attendees.map((attendee) => attendee.fullName).join(", ")}
        directionalHint={DirectionalHint.leftCenter}
      >
        <Stack verticalFill verticalAlign="center">
          <Facepile
            overflowButtonType={OverflowButtonType.descriptive}
            showTooltip={false}
            personaSize={PersonaSize.size16}
            personas={attendees.map((attendee) => ({
              personaName: attendee.fullName,
              imageUrl: attendee.avatarUrl,
            }))}
          />
        </Stack>
      </TooltipHost>
    );
  };

  const onRenderDungeonMaster = (session: Session) => {
    return session.dungeonMaster?.name ?? "Unassigned";
  };

  const onRenderMap = (session: Session) => {
    return session.map.name;
  };

  const onRenderDate = (session: Session) => {
    return session.date ? new Date(session.date).toDateString() : "Unscheduled";
  };

  const onRenderActions = (session: Session) => {
    if (
      !session ||
      sessionInterests.isLoading ||
      currentPlayer.isLoading ||
      activeCharacter.isLoading ||
      !activeCharacter.data
    ) {
      return null;
    }

    const playerInterestInSession = sessionInterests.data.find(
      (interest) =>
        interest.playerId === currentPlayer.data?.id &&
        interest.sessionId === session.id
    );

    const playerIsInterested = !!playerInterestInSession;

    const onClickRemoveFromSession = async (session: Session) => {
      if (!playerInterestInSession) {
        console.log("No interest in session");

        return;
      }

      console.log("Remove from session", session, playerInterestInSession);

      await DataService.unregisterFromSession(playerInterestInSession);
    };

    const onClickAddToSession = (session: Session) => {
      console.log("Add to session", session);

      dispatch({
        type: "SetSessionRegistration",
        sessionRegistration: { isShown: true, session: session },
      });
    };

    const registerIcon: IIconProps = {
      iconName: "AddFriend",
    };

    const unregisterIcon: IIconProps = {
      iconName: "UserRemove",
    };

    return (
      <Stack
        className="icon-button-container"
        horizontal
        styles={{ root: { margin: -6 } }}
      >
        {DataHelper.isDateInPast(session.date!) ? (
          <Stack styles={{ root: { width: 52 } }}></Stack>
        ) : playerIsInterested ? (
          <TooltipHost content="Unregister from session">
            <IconButton
              iconProps={unregisterIcon}
              disabled={false}
              onClick={() => onClickRemoveFromSession(session)}
            />
          </TooltipHost>
        ) : (
          <TooltipHost content="Register for session">
            <IconButton
              iconProps={registerIcon}
              disabled={false}
              onClick={() => onClickAddToSession(session)}
            />
          </TooltipHost>
        )}
      </Stack>
    );
  };

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 250,
    },
    {
      key: "dungeonMaster",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: 100,
      onRender: onRenderDungeonMaster,
    },
    {
      key: "map",
      name: "Map",
      fieldName: "map",
      minWidth: 150,
      onRender: onRenderMap,
    },
    {
      key: "attendees",
      name: "Attendees",
      fieldName: "attendees",
      minWidth: 150,
      onRender: onRenderAttendees,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "scheduledDate",
      minWidth: 150,
      onRender: onRenderDate,
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 50,
      onRender: onRenderActions,
    },
  ];

  return (
    <Stack
      styles={{
        root: {
          display: "flex",
          flexFlow: "column nowrap",
          width: "auto",
          height: "auto",
          boxSizing: "border-box",
          maxHeight: "50%",
          overflow: "auto",
        },
      }}
    >
      <ShimmeredDetailsList
        columns={columns}
        enableShimmer={sessions.isLoading}
        items={sessions.isLoading ? [] : sessions.data}
        selectionMode={SelectionMode.none}
      />
    </Stack>
  );
};

export default SessionTable;
