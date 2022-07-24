import {
  DefaultButton,
  DialogFooter,
  DirectionalHint,
  Facepile,
  FontSizes,
  FontWeights,
  IColumn,
  MessageBar,
  MessageBarType,
  Modal,
  OverflowButtonType,
  PersonaSize,
  PrimaryButton,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  TooltipHost,
  useTheme,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import { Player } from "../../Types/LocalStructures";

const SessionManagementDialog = () => {
  const dispatch = useDispatch();

  const sessionManagement = useSelector((state) => state.sessionManagement);
  const sessions = useSelector((state) => state.sessions);
  const players = useSelector((state) => state.players);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  const theme = useTheme();

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

  const getInterestedUsers = () => {
    if (
      sessions.isLoading ||
      players.isLoading ||
      sessionInterests.isLoading ||
      !sessionManagement.isShown
    ) {
      return [];
    } else {
      return players.data.filter((player) =>
        sessionInterests.data
          .filter(
            (interest) =>
              interest.sessionId ===
              sessions.data.find(
                (session) => session.id === sessionManagement.session.id
              )?.id
          )
          .map((interest) => interest.playerId)
          .includes(player.id)
      );
    }
  };

  const onRenderPlayers = (datesAndUsers: {
    date: string;
    interestedUsers: Player[];
  }) => {
    const interestedUsersToRender = datesAndUsers.interestedUsers
      .map((user) => ({
        date: dates,
        user: user,
      }))
      .sort((userA, userB) => userA.user.name.localeCompare(userB.user.name));

    return (
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <span>{datesAndUsers.interestedUsers.length}</span>
        <TooltipHost
          content={interestedUsersToRender
            .map(({ user }) => user.name)
            .join(", ")}
          directionalHint={DirectionalHint.leftCenter}
        >
          <Facepile
            overflowButtonType={OverflowButtonType.descriptive}
            showTooltip={false}
            personaSize={PersonaSize.size24}
            personas={interestedUsersToRender.map(({ user }) => ({
              personaName: user.name,
            }))}
          />
        </TooltipHost>
      </Stack>
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
      key: "users",
      name: "Players",
      fieldName: "users",
      minWidth: 50,
      isResizable: true,
      onRender: onRenderPlayers,
    },
  ];

  const dates = Array.from(
    new Set(
      getInterestedUsers()
        .flatMap((user) => user.availableDates)
        .sort()
    )
  ).map((date) => ({
    date: DataHelper.getDateInDayDateMonthFormat(new Date(date)),
    interestedUsers: getInterestedUsers().filter((user) =>
      user.availableDates.includes(date)
    ),
  }));

  return (
    <Modal isOpen={sessionManagement.isShown} onDismiss={onDismiss}>
      <Stack
        tokens={{ childrenGap: 10 }}
        styles={{
          root: {
            padding: 24,
            borderTopWidth: 4,
            borderTopStyle: "solid",
            borderTopColor: theme.palette.accent,
            minWidth: 400,
          },
        }}
      >
        <Text
          styles={{
            root: {
              color: theme.palette.accent,
              fontSize: FontSizes.xLarge,
              fontWeight: FontWeights.semibold,
            },
          }}
        >
          {sessionManagement.isShown ? sessionManagement.session.name : ""}
        </Text>
        {getInterestedUsers().length > 0 ? (
          <>
            <Text>Please select a date for this session.</Text>
            <ShimmeredDetailsList
              items={dates}
              selectionMode={SelectionMode.single}
              columns={columns}
            />
          </>
        ) : (
          <MessageBar messageBarType={MessageBarType.error}>
            No players have selected any available dates for this session .
          </MessageBar>
        )}
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <PrimaryButton text="Save" onClick={onClickSave} />
        </DialogFooter>
      </Stack>
    </Modal>
  );
};

export default SessionManagementDialog;
