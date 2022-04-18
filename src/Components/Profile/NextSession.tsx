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
import { useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import ISessionData from "../../Interfaces/ISessionData";
import SessionCard from "../Cards/SessionCard";

const NextSession = () => {
  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);
  const activeCharacter = useSelector((state) => state.activeCharacter);

  let upcomingSessions = [] as ISessionData[];

  if (
    !activeCharacter.isLoading &&
    activeCharacter.data &&
    !sessions.isLoading
  ) {
    upcomingSessions = sessions.data.filter(
      (session) =>
        session.attendees.includes(activeCharacter.data!.id) &&
        !DataHelper.isDateInPast(new Date(session.date))
    );
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

  return (
    <Stack tokens={{ childrenGap: 0 }}>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLarge, textAlign: "start" },
          }}
        >
          Next Session
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            text="New"
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

export default NextSession;
