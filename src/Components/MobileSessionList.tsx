import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import SessionCard from "./Cards/SessionCard";

const MobileCharacterList = () => {
  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{ root: { width: "100%", padding: "1em" } }}
    >
      {!sessions.isLoading &&
        !characters.isLoading &&
        sessions.data.map((session) => (
          <SessionCard session={session} characters={characters.data} />
        ))}
    </Stack>
  );
};

export default MobileCharacterList;
