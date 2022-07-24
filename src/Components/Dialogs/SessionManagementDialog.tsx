import {
  Checkbox,
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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SessionRole from "../../Enums/SessionRole";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import { Player } from "../../Types/LocalStructures";

const SessionManagementDialog = () => {
  const dispatch = useDispatch();

  const sessionManagement = useSelector((state) => state.sessionManagement);
  const sessions = useSelector((state) => state.sessions);
  const players = useSelector((state) => state.players);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  const [selectedDate, setSelectedDate] = useState<number | undefined>(
    undefined
  );

  const theme = useTheme();

  const onDismiss = () => {
    setSelectedDate(undefined);

    dispatch({
      type: "SetSessionManagement",
      sessionManagement: { isShown: false },
    });
  };

  const onClickSave = async () => {
    if (!sessionManagement.isShown || !selectedDate) {
      return;
    }

    console.log("Clicked save");

    await DataService.setDateForSession(
      sessionManagement.session,
      selectedDate
    );
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

  const dungeonMaster =
    sessions.isLoading ||
    players.isLoading ||
    sessionInterests.isLoading ||
    !sessionManagement.isShown
      ? undefined
      : players.data.find((player) =>
          sessionInterests.data.find(
            (interest) =>
              interest.playerId === player.id &&
              interest.sessionId === sessionManagement.session.id &&
              interest.role === SessionRole["Dungeon Master"]
          )
        );

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

  const onRenderSelect = (datesAndUsers: {
    date: number;
    displayDate: string;
    interestedUsers: Player[];
  }) => {
    const onChange = (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
      checked?: boolean | undefined
    ) => {
      if (checked) {
        setSelectedDate(datesAndUsers.date);
      } else {
        setSelectedDate(undefined);
      }
    };

    return (
      <Checkbox
        onChange={onChange}
        checked={selectedDate === datesAndUsers.date}
      />
    );
  };

  const columns: IColumn[] = [
    {
      key: "select",
      name: "",
      fieldName: "select",
      minWidth: 25,
      maxWidth: 40,
      onRender: onRenderSelect,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "displayDate",
      minWidth: 25,
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
  )
    .map((date) => ({
      date: date,
      displayDate: DataHelper.getDateInDayDateMonthFormat(new Date(date)),
      interestedUsers: getInterestedUsers().filter((user) =>
        user.availableDates.includes(date)
      ),
    }))
    .filter((date) => !DataHelper.isDateInPast(date.date));

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
            {!dungeonMaster && (
              <MessageBar messageBarType={MessageBarType.error}>
                No dungeon master found for this session.
              </MessageBar>
            )}
            <Text>Please select a date for this session.</Text>
            {dungeonMaster && (
              <Stack>
                <Text>
                  {`The Dungeon Master for this session is ${dungeonMaster.name}.`}
                </Text>
                <Text>
                  {`Please ensure they are available on the selected date.`}
                </Text>
              </Stack>
            )}
            <ShimmeredDetailsList
              items={dates}
              selectionMode={SelectionMode.none}
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
          <PrimaryButton
            text="Save"
            onClick={onClickSave}
            disabled={!selectedDate || !dungeonMaster}
          />
        </DialogFooter>
      </Stack>
    </Modal>
  );
};

export default SessionManagementDialog;
