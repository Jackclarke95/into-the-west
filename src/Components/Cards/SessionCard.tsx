import {
  IFacepilePersona,
  Facepile,
  PersonaSize,
  Stack,
  Text,
  FontSizes,
} from "@fluentui/react";
import { Session, Character } from "../../Types/LocalStructures";

const SessionCard: React.FC<{
  session: Session;
  characters: Character[];
}> = ({ session, characters }) => {
  const onRenderAttendees = () => {
    const personas = session.attendees
      .map((attendee) => {
        const matchedCharacter = characters.find(
          (character) => character.id === attendee.id
        );

        return {
          imageUrl: matchedCharacter?.avatarUrl,
          personaName: matchedCharacter?.fullName,
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
      <Stack horizontal tokens={{ childrenGap: 5 }}>
        <Text
          styles={{
            root: {
              fontSize: FontSizes.size16,
            },
          }}
        >
          {session.name}
        </Text>
      </Stack>
      <Stack
        horizontal
        styles={{
          root: { width: "100%", justifyContent: "space-between" },
        }}
      >
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Text styles={{ root: { fontWeight: "bold" } }}>Players:</Text>
          {onRenderAttendees()}
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Text styles={{ root: { fontWeight: "bold" } }}>Map:</Text>
          <Text>{session.map.name}</Text>
        </Stack>
      </Stack>
      <Stack
        horizontal
        styles={{
          root: { width: "100%", justifyContent: "space-between" },
        }}
      >
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Text styles={{ root: { fontWeight: "bold" } }}>DM:</Text>
          <Text>
            {session.dungeonMaster ? session.dungeonMaster?.name : "Unassigned"}
          </Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Text styles={{ root: { fontWeight: "bold" } }}>Date:</Text>
          <Text>
            {session.date
              ? new Date(session.date).toLocaleDateString()
              : "Unscheduled"}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SessionCard;
