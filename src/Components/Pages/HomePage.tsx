import {
  MessageBar,
  MessageBarType,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import { useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import { Session } from "../../Types/LocalStructures";
import CharacterCard from "../Cards/CharacterCard";
import SessionCard from "../Cards/SessionCard";
import BasePage from "./BasePage";

const HomePage = () => {
  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);
  const currentPlayer = useSelector((state) => state.currentPlayer);
  const activeCharacter = useSelector((state) => state.activeCharacter);

  const UpcomingSession: React.FC<{ session: Session }> = ({ session }) => {
    if (characters.isLoading) {
      return <div>Loading...</div>;
    }

    return <SessionCard characters={characters.data} session={session} />;
  };

  const UpcomingSessions: React.FC<{ sessions: Session[] }> = ({
    sessions,
  }) => {
    return (
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: "50%" } }}>
        <Text variant="xxLarge">Upcoming Sessions</Text>

        {sessions
          .filter(
            (session) => !session.date || !DataHelper.isDateInPast(session.date)
          )
          .map((session) => (
            <UpcomingSession key={session.id} session={session} />
          ))}
      </Stack>
    );
  };

  const Actions: React.FC = () => {
    const ActiveCharacter: React.FC = () => {
      if (activeCharacter.isLoading || currentPlayer.isLoading) {
        return <div>Loading...</div>;
      } else if (!activeCharacter.isLoading && activeCharacter.data) {
        return (
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { width: "50%" } }}
          >
            <Text variant="large">Your Character</Text>
            {activeCharacter.data.currentLevel! <
              currentPlayer.data?.characterLevel! && (
              <MessageBar
                messageBarType={MessageBarType.success}
                isMultiline={false}
              >
                You have reached level {activeCharacter.data.currentLevel}!
              </MessageBar>
            )}
            <CharacterCard character={activeCharacter.data} />
          </Stack>
        );
      } else
        return (
          <MessageBar messageBarType={MessageBarType.warning}>
            You have no active character. Please create a character to
          </MessageBar>
        );
    };

    return (
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: "50%" } }}>
        <Text variant="xxLarge">Actions</Text>
        <ActiveCharacter />
      </Stack>
    );
  };

  return (
    <BasePage pageTitle="Home">
      <Stack
        tokens={{ childrenGap: 20 }}
        verticalFill
        styles={{
          root: {
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
          },
        }}
      >
        <Stack tokens={{ childrenGap: 20 }} horizontal verticalFill>
          <UpcomingSessions
            sessions={sessions.isLoading ? [] : sessions.data}
          />
          <Separator vertical />
          <Actions />
        </Stack>
      </Stack>
    </BasePage>
  );
};

export default HomePage;
