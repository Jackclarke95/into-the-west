import {
  DefaultButton,
  FontSizes,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import ISession from "../../Interfaces/ISession";
import SessionCard from "../Cards/SessionCard";

const NextSession = () => {
  const dispatch = useDispatch();

  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);
  const activeCharacter = useSelector((state) => state.activeCharacter);
  const isDevMode = useSelector((state) => state.isDevMode);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  let upcomingSessions = [] as ISession[];

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
          (session.attendees.includes(activeCharacter.data!.key) ||
            session.dungeonMaster === currentPlayer.data!.dndBeyondName) &&
          ((session.date && !DataHelper.isDateInPast(new Date(session.date))) ||
            !session.date)
        );
      })
      .sort((sessionA, sessionB) => {
        return DataHelper.sortNullableDatesAscending(
          sessionA.date,
          sessionB.date
        );
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
      return upcomingSessions.map((session) => (
        <SessionCard session={session} characters={characters.data} />
      ));
    }
  };

  const onClickCreateSession = () => {
    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  return (
    <Stack tokens={{ childrenGap: 0 }}>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLarge, textAlign: "start" },
          }}
        >
          My Sessions
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            text="New"
            onClick={onClickCreateSession}
            disabled={
              !isDevMode || activeCharacter.isLoading || !activeCharacter.data
            }
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

export default NextSession;
