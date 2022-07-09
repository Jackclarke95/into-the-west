import {
  DefaultButton,
  DialogFooter,
  DirectionalHint,
  Facepile,
  FontSizes,
  FontWeights,
  IColumn,
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
import IUser from "../../Interfaces/IUser";

const SessionManagementDialog = () => {
  const dispatch = useDispatch();

  const sessionManagement = useSelector((state) => state.sessionManagement);
  const sessions = useSelector((state) => state.sessions);
  const users = useSelector((state) => state.players);
  const eventInterests = useSelector((state) => state.eventInterests);

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
      users.isLoading ||
      eventInterests.isLoading ||
      !sessionManagement.isShown
    ) {
      return [];
    } else {
      return users.data.filter((user) =>
        eventInterests.data
          .filter(
            (interest) =>
              interest.eventId ===
              sessions.data.find(
                (session) => session.key === sessionManagement.session.id
              )!.key
          )
          .map((interest) => interest.playerId)
          .includes(user.key)
      );
    }
  };

  const onRenderPlayers = (datesAndUsers: {
    date: string;
    interestedUsers: IUser[];
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
        <Text>Please select a date for this session.</Text>
        <ShimmeredDetailsList
          items={dates}
          selectionMode={SelectionMode.single}
          columns={columns}
        />
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <PrimaryButton text="Save" onClick={onClickSave} />
        </DialogFooter>
      </Stack>
    </Modal>
  );
};

export default SessionManagementDialog;
