import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Facepile,
  IColumn,
  PersonaSize,
  PrimaryButton,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import IUser from "../../Interfaces/IUser";

const SessionManagementDialog = () => {
  const dispatch = useDispatch();

  const sessionManagement = useSelector((state) => state.sessionManagement);
  const sessions = useSelector((state) => state.sessions);
  const users = useSelector((state) => state.users);
  const eventInterests = useSelector((state) => state.eventInterests);
  const characters = useSelector((state) => state.characters);

  const onDismiss = () => {
    dispatch({
      type: "SetSessionManagement",
      sessionManagement: { isShown: false },
    });
  };

  const onClickSave = () => {
    console.log("Clicked save");

    onDismiss();
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Manage session",
    closeButtonAriaLabel: "Close",
  };

  const interestedUsers =
    sessions.isLoading ||
    users.isLoading ||
    eventInterests.isLoading ||
    !sessionManagement.isShown
      ? []
      : users.data.filter((user) =>
          eventInterests.data
            .filter(
              (interest) =>
                interest.eventId ===
                sessions.data.find(
                  (session) => session.key === sessionManagement.session.key
                )!.key
            )
            .map((interest) => interest.userId)
            .includes(user.key)
        );

  const onRenderPlayers = (datesAndUsers: {
    date: string;
    interestedUsers: IUser[];
  }) => {
    if (characters.isLoading) {
      return;
    }

    const charactersToRender = datesAndUsers.interestedUsers
      .map((user) => ({
        character: characters.data.find(
          (character) => character.playerDndBeyondName === user.dndBeyondName
        ),
      }))
      .map((character) => character.character);

    return (
      <Facepile
        personaSize={PersonaSize.size24}
        personas={charactersToRender.map((character) => ({
          imageUrl: character?.avatarUrl,
          personaName: character?.name,
        }))}
      />
    );
  };

  const onRenderTotalPlayers = (datesAndUsers) => {
    return (
      <span
        style={{
          display: "block",
          textAlign: "left",
          paddingLeft: "1em",
        }}
      >
        {datesAndUsers.interestedUsers.length}
      </span>
    );
  };

  const columns: IColumn[] = [
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 10,
      maxWidth: 70,
      isResizable: true,
    },
    {
      key: "userCount",
      name: "Total",
      fieldName: "userCount",
      minWidth: 20,
      maxWidth: 40,
      isResizable: true,
      onRender: onRenderTotalPlayers,
    },
    {
      key: "users",
      name: "Players",
      fieldName: "users",
      minWidth: 20,
      maxWidth: 50,
      isResizable: true,
      onRender: onRenderPlayers,
    },
  ];

  const dates = Array.from(
    new Set(interestedUsers.flatMap((user) => user.availableDates).sort())
  ).map((date) => ({
    date: new Date(date).toLocaleDateString(),
    interestedUsers: interestedUsers.filter((user) =>
      user.availableDates.includes(date)
    ),
  }));

  const onClickDetermineInterests = () => {
    if (
      sessions.isLoading ||
      users.isLoading ||
      eventInterests.isLoading ||
      !sessionManagement.isShown
    ) {
      return;
    }

    console.log(eventInterests.data);

    const interestedUsers = users.data.filter((user) =>
      eventInterests.data
        .filter(
          (interest) =>
            interest.eventId ===
            sessions.data.find(
              (session) => session.key === sessionManagement.session.key
            )!.key
        )
        .map((interest) => interest.userId)
        .includes(user.key)
    );

    console.log({ interestedUsers });
    console.log({ datesToShow: dates });
  };

  return (
    <Dialog
      hidden={sessionManagement.isShown === false}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <DefaultButton
        text="Determine interests"
        onClick={onClickDetermineInterests}
      />
      <ShimmeredDetailsList
        compact
        items={dates}
        selectionMode={SelectionMode.single}
        columns={columns}
      />
      <Stack>
        <Text>Interested Users:</Text>
        {interestedUsers.map((user) => (
          <Text>{user.name}</Text>
        ))}
      </Stack>
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Save" onClick={onClickSave} />
      </DialogFooter>
    </Dialog>
  );
};

export default SessionManagementDialog;
