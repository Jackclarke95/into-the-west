import {
  IFacepilePersona,
  Facepile,
  PersonaSize,
  Stack,
  Text,
} from "@fluentui/react";
import ICharacterData from "../../Interfaces/ICharacterData";
import ISessionData from "../../Interfaces/ISessionData";

const SessionCard: React.FC<{
  session: ISessionData;
  characters: ICharacterData[];
}> = ({ session, characters }) => {
  const onRenderAttendees = () => {
    const personas = session.attendees
      .map((attendee) => {
        const matchedCharacter = characters.find(
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
    <Stack tokens={{ childrenGap: 5 }}>
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
};

export default SessionCard;
