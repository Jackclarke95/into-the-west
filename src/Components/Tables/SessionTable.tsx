import {
  DirectionalHint,
  Facepile,
  IColumn,
  IconButton,
  IGroup,
  IIconProps,
  OverflowButtonType,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  TooltipHost,
  useTheme,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import { Character, Session } from "../../Types/LocalStructures";

const SessionTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const sessions = useSelector((state) => state.sessions);
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const sessionInterests = useSelector((state) => state.sessionInterests);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  const [sortedSessions, setSortedSessions] = useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (sessions.isLoading) {
      setSortedSessions([]);

      return;
    }

    const sortedSessions = [...sessions.data].sort((a, b) => {
      if (a.date && b.date) {
        return b.date - a.date;
      } else if (a.date && !b.date) {
        return 1;
      } else if (b.date && !a.date) {
        return -1;
      } else {
        return 0;
      }
    });

    setSortedSessions(sortedSessions);
  }, [sessions]);

  useEffect(() => {
    const sessionsToFilter = [...sortedSessions].sort((a, b) =>
      a.date && b.date ? b.date - a.date : -1
    );

    const previousSessions = sessionsToFilter.filter(
      (session) => session.date && DataHelper.isDateInPast(session.date)
    );

    const upcomingSessions = sessionsToFilter.filter(
      (session) => !(session.date && DataHelper.isDateInPast(session.date))
    );

    setPastSessions(previousSessions);
    setUpcomingSessions(upcomingSessions);
  }, [sortedSessions]);

  const onRenderName = (session: Session) => {
    const onClickName = () => {
      navigate(`${session.id}`);
    };

    const nameStyles = {
      root: {
        color: theme.palette.accent,
        width: "fit-content",
        "&:hover": {
          cursor: "pointer",
          textDecoration: "underline",
          color: theme.palette.themeDarkAlt,
        },
      },
    };

    return (
      <Stack onClick={onClickName} styles={nameStyles}>
        {session.name}
      </Stack>
    );
  };

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
        return;
      }

      dispatch({
        type: "SetConfirmation",
        confirmation: {
          isShown: true,
          message: "Are you sure you wish to unregister from this session?",
          onConfirm: async () =>
            await DataService.unregisterFromSession(playerInterestInSession),
        },
      });
    };

    const onClickAddToSession = (session: Session) => {
      dispatch({
        type: "SetSessionRegistration",
        sessionRegistration: { isShown: true, session: session },
      });
    };

    const onClickManageSession = (session: Session) => {
      dispatch({
        type: "SetSessionManagement",
        sessionManagement: { isShown: true, session: session },
      });
    };

    const onClickCompleteSession = (session: Session) => {
      dispatch({
        type: "SetSessionCompletion",
        sessionCompletion: { isShown: true, session: session },
      });
    };

    const registerIcon: IIconProps = {
      iconName: "AddFriend",
    };

    const unregisterIcon: IIconProps = {
      iconName: "UserRemove",
    };

    const manageIcon: IIconProps = {
      iconName: "Settings",
    };

    const completeIcon: IIconProps = {
      iconName: "Checkmark",
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
        {!DataHelper.isDateInPast(session.date!) &&
          !currentPlayer.isLoading &&
          (currentPlayer.data?.isDungeonMaster ||
            session.suggestedByPlayerId === currentPlayer.data?.id) && (
            <Stack
              className="icon-button-container"
              horizontal
              verticalAlign="center"
              styles={{ root: { margin: -6 } }}
            >
              <TooltipHost content="Manage session">
                <IconButton
                  iconProps={manageIcon}
                  disabled={false}
                  onClick={() => onClickManageSession(session)}
                />
              </TooltipHost>
            </Stack>
          )}
        {!session.isCompleted && DataHelper.isDateInPast(session.date!) && (
          <TooltipHost content="Complete session">
            <IconButton
              iconProps={completeIcon}
              disabled={false}
              onClick={() => onClickCompleteSession(session)}
            />
          </TooltipHost>
        )}
      </Stack>
    );
  };

  const widerColumnWidth = 250;
  const defaultColumnWidth = 150;
  const narrowColumnWidth = 100;

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: widerColumnWidth,
      isResizable: true,
      onRender: onRenderName,
    },
    {
      key: "dungeonMaster",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: defaultColumnWidth,
      isResizable: true,
      onRender: onRenderDungeonMaster,
    },
    {
      key: "map",
      name: "Map",
      fieldName: "map",
      minWidth: defaultColumnWidth,
      isResizable: true,
      onRender: onRenderMap,
    },
    {
      key: "attendees",
      name: "Attendees",
      fieldName: "attendees",
      minWidth: defaultColumnWidth,
      isResizable: true,
      onRender: onRenderAttendees,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "scheduledDate",
      minWidth: defaultColumnWidth,
      isResizable: true,
      onRender: onRenderDate,
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: narrowColumnWidth,
      isResizable: true,
      onRender: onRenderActions,
    },
  ];

  const groups: IGroup[] = [
    {
      key: "upcoming",
      name: "Upcoming Sessions",
      startIndex: 0,
      count: upcomingSessions.length,
    },
    {
      key: "past",
      name: "Past Sessions",
      startIndex: upcomingSessions.length,
      count: pastSessions.length,
    },
  ];

  return (
    <ShimmeredDetailsList
      columns={columns}
      enableShimmer={sessions.isLoading}
      items={sortedSessions}
      selectionMode={SelectionMode.none}
      groups={groups}
    />
  );
};

export default SessionTable;
