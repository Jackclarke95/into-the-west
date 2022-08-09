import {
  DefaultButton,
  FontSizes,
  MessageBar,
  MessageBarType,
  Separator,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../../Helpers/DataHelper";
import { Session } from "../../../Types/LocalStructures";
import SessionCard from "../Cards/SessionCard";

const UpcomingSessions = () => {
  const dispatch = useDispatch();

  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  let upcomingSessions = [] as Session[];

  if (
    !currentPlayer.isLoading &&
    currentPlayer.data &&
    !activeCharacter.isLoading &&
    activeCharacter.data &&
    !sessions.isLoading
  ) {
    upcomingSessions = sessions.data
      .filter((session) => {
        return (
          (session.attendees.interested
            .map((attendee) => attendee.id)
            .includes(activeCharacter.data!.id) ||
            session.dungeonMaster?.id === currentPlayer.data!.id) &&
          ((session.date && !DataHelper.isDateInPast(session.date)) ||
            !session.date)
        );
      })
      .sort((sessionA, sessionB) => {
        if (!!sessionA.date && !!sessionB.date) {
          return DataHelper.sortNullableDatesAscending(
            new Date(sessionA.date),
            new Date(sessionB.date)
          );
        } else {
          return 0;
        }
      });
  }

  const dataToRender = () => {
    if (
      activeCharacter.isLoading ||
      sessions.isLoading ||
      characters.isLoading
    ) {
      return (
        <Spinner size={SpinnerSize.large} label="Loading Upcoming Sessions" />
      );
    } else if (!activeCharacter.data) {
      return (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          You do not have an character. Create a new character using the button
          above.
        </MessageBar>
      );
    } else if (upcomingSessions.length === 0) {
      return (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          You have no upcoming sessions. Suggest a new adventure or apply to an
          upcoming one.
        </MessageBar>
      );
    } else {
      return upcomingSessions.map((session, index) => {
        return (
          <Stack>
            <SessionCard session={session} characters={characters.data} />
            {index < upcomingSessions.length - 1 && <Separator />}
          </Stack>
        );
      });
    }
  };

  const onClickCreateSession = () => {
    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLarge, textAlign: "start" },
          }}
        >
          Upcoming sessions
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            text="New"
            onClick={onClickCreateSession}
            disabled={activeCharacter.isLoading || !activeCharacter.data}
          />
        </Stack>
      </Stack>
      <Stack
        verticalAlign="center"
        styles={{ root: { minHeight: 72, width: 350 } }}
      >
        {dataToRender()}
      </Stack>
    </Stack>
  );
};

export default UpcomingSessions;
