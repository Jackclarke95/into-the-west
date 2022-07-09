import {
  Facepile,
  IColumn,
  IconButton,
  IContextualMenuProps,
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
import { Session } from "../../Types/LocalStructures";

const NewSessionTable = () => {
  const dispatch = useDispatch();

  const sessions = useSelector((state) => state.parsedSessions);
  const activeCharacter = useSelector((state) => state.activeCharacter);

  const onRenderAttendees = (session) => {
    return (
      <Facepile
        overflowButtonType={OverflowButtonType.descriptive}
        showTooltip={false}
        personaSize={PersonaSize.size24}
        personas={session.attendees.map((attendee) => ({
          personaName: attendee.name,
        }))}
      />
    );
  };

  const onRenderDungeonMaster = (session) => {
    return session.dungeonMaster?.name;
  };

  const onRenderDate = (session) => {
    return new Date(session.date).toDateString();
  };

  const onRenderActions = (session: Session) => {
    if (!session || activeCharacter.isLoading || !activeCharacter.data) {
      return null;
    }

    const onClickManageSession = () => {
      dispatch({
        type: "SetSessionManagement",
        sessionManagement: { isShown: true, session: session },
      });
    };

    const onClickRemoveFromSession = (session: Session) => {
      console.log("Remove from session", session);
    };

    const onClickAddToSession = (session: Session) => {
      console.log("Add to session", session);
    };

    const settingsIcon: IIconProps = {
      iconName: "settings",
    };
    const sessionManagementIcon: IIconProps = {
      iconName: "WorkforceManagement",
    };

    const menuProps: IContextualMenuProps = {
      items: session.attendees
        ? [
            session.attendees
              .map((character) => character.id)
              .includes(activeCharacter.data.key)
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
                  onClick: () => onClickAddToSession(session),
                },
            {
              key: "calendarEvent",
              text: "Volunteer as DM",
              iconProps: { iconName: "WorkforceManagement" },
            },
          ]
        : [],
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
      minWidth: 250,
    },
    {
      key: "dungeonMaster",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: 150,
      onRender: onRenderDungeonMaster,
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

export default NewSessionTable;
