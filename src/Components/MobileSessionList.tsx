import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import DataHelper from "../Helpers/DataHelper";
import SessionCard from "./Cards/SessionCard";

const MobileCharacterList = () => {
  const sessions = useSelector((state) => state.sessions);
  const characters = useSelector((state) => state.characters);

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{ root: { width: "100vw", padding: "1em" } }}
    >
      {!sessions.isLoading &&
        !characters.isLoading &&
        sessions.data
          // .sort((sessionA, sessionB) =>
          //   DataHelper.sortNullableDatesDescending(sessionA.date, sessionB.date)
          // )
          .map((session) => (
            <SessionCard session={session} characters={characters.data} />
          ))}
    </Stack>
  );
};

export default MobileCharacterList;
