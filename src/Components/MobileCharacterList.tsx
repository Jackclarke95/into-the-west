import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import MobileCharacterCard from "./Cards/MobileCharacterCard";

const MobileCharacterList = () => {
  const characters = useSelector((state) => state.characters);

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          width: "100vw",
          height: "100vh",
        },
      }}
    >
      {!characters.isLoading &&
        characters.data.map((character) => (
          <MobileCharacterCard character={character} />
        ))}
    </Stack>
  );
};

export default MobileCharacterList;
