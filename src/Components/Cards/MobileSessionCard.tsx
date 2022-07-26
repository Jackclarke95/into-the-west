import { Stack, Text } from "@fluentui/react";
import { Session } from "../../Types/LocalStructures";

const MobileSessionCard: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <Stack>
      <Text>{session.name}</Text>
    </Stack>
  );
};

export default MobileSessionCard;
