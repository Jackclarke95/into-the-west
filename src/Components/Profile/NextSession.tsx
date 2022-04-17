import {
  DefaultButton,
  Facepile,
  FontSizes,
  IFacepilePersona,
  MessageBar,
  MessageBarType,
  PersonaSize,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import ISessionData from "../../Interfaces/ISessionData";

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
      return upcomingSessions.map((session) => {
        const onRenderAttendees = () => {
          const personas = session.attendees
            .map((attendee) => {
              const matchedCharacter = characters.data.find(
                (character) => character.id === attendee
              );

              return {
                imageUrl: matchedCharacter?.avatarUrl,
                personaName: matchedCharacter?.name,
              } as IFacepilePersona;
            })
            .sort((a, b) => a.personaName!.localeCompare(b.personaName!));

          return (
            <Facepile
              personas={personas}
              personaSize={PersonaSize.size16}
              maxDisplayablePersonas={personas.length}
            />
          );
        };

        return (
          <Stack tokens={{ childrenGap: 5, padding: 5 }}>
            <Stack
              horizontal
              styles={{
                root: { width: "100%", justifyContent: "space-between" },
              }}
            >
              <Stack horizontal tokens={{ childrenGap: 5 }}>
                <Text styles={{ root: { fontWeight: "bold" } }}>DM:</Text>
                <Text>{session.dungeonMaster}</Text>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 5 }}>
                <Text styles={{ root: { fontWeight: "bold" } }}>Date:</Text>
                <Text>{new Date(session.date).toLocaleDateString()}</Text>
              </Stack>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 5 }}>
              <Text styles={{ root: { fontWeight: "bold" } }}>Name:</Text>
              <Text>{session.name}</Text>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 5 }}>
              <Text styles={{ root: { fontWeight: "bold" } }}>Map:</Text>
              <Text>{session.map}</Text>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 5 }}>
              <Text styles={{ root: { fontWeight: "bold" } }}>Players:</Text>
              {onRenderAttendees()}
            </Stack>
          </Stack>
        );
      });
    }
  };

  console.log({ upcomingSessions });

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
