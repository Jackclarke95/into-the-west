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

  const getInterestedPlayers = () => {
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

  const onRenderPlayers = (datesAndPlayers: {
    date: string;
    interestedPlayers: Player[];
  }) => {
    const interestedPlayersToRender = datesAndPlayers.interestedPlayers
      .map((player) => ({
        date: dates,
        player: player,
      }))
      .sort((playerA, playerB) =>
        playerA.player.name.localeCompare(playerB.player.name)
      );

    return (
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <span>{datesAndPlayers.interestedPlayers.length}</span>
        <TooltipHost
          content={interestedPlayersToRender
            .map(({ player }) => player.name)
            .join(", ")}
          directionalHint={DirectionalHint.leftCenter}
        >
          <Facepile
            overflowButtonType={OverflowButtonType.descriptive}
            showTooltip={false}
            personaSize={PersonaSize.size24}
            personas={interestedPlayersToRender.map(({ player }) => ({
              personaName: player.name,
            }))}
          />
        </TooltipHost>
      </Stack>
    );
  };

  const onRenderSelect = (datesAndPlayers: {
    date: number;
    displayDate: string;
    interestedPlayers: Player[];
  }) => {
    const onChange = (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
      checked?: boolean | undefined
    ) => {
      if (checked) {
        setSelectedDate(datesAndPlayers.date);
      } else {
        setSelectedDate(undefined);
      }
    };

    return (
      <Checkbox
        onChange={onChange}
        checked={selectedDate === datesAndPlayers.date}
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
      key: "players",
      name: "Players",
      fieldName: "players",
      minWidth: 50,
      isResizable: true,
      onRender: onRenderPlayers,
    },
  ];

  const dates = Array.from(
    new Set(
      getInterestedPlayers()
        .flatMap((player) => player.availableDates)
        .sort()
    )
  )
    .map((date) => ({
      date: date,
      displayDate: DataHelper.getDateInDayDateMonthFormat(new Date(date)),
      interestedPlayers: getInterestedPlayers().filter((player) =>
        player.availableDates.includes(date)
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
        {getInterestedPlayers().length > 0 && dates.length > 0 ? (
          <>
            {!dungeonMaster && (
              <MessageBar messageBarType={MessageBarType.error}>
                No Dungeon Master found for this session.
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
              compact
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
