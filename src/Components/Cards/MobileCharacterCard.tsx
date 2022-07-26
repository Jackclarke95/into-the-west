import { Stack, Text } from "@fluentui/react";
import { Character } from "../../Types/LocalStructures";

const MobileCharacterCard: React.FC<{ character: Character }> = ({
  character,
}) => {
  return (
    <Stack>
      <Text>{character.fullName}</Text>
    </Stack>
  );
};

export default MobileCharacterCard;
