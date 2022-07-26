import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import MobileSessionCard from "./Cards/MobileSessionCard";

const MobileCharacterList = () => {
  const sessions = useSelector((state) => state.sessions);

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{
        root: {
          width: "100vw",
          overflow: "auto",
        },
      }}
    >
      {!sessions.isLoading &&
        sessions.data.map((session) => <MobileSessionCard session={session} />)}
    </Stack>
  );
};

export default MobileCharacterList;
