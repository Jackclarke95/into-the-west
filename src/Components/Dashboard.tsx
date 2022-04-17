import { FontSizes, Stack, Text } from "@fluentui/react";
import CharacterTable from "./CharacterTable";
import SessionTable from "./SessionTable";
import Profile from "./Profile";

const Dashboard = () => {
  return (
    <Stack
      className="body-container"
      verticalFill
      horizontal
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{ root: { overflowY: "auto", height: "100%", width: "100%" } }}
    >
      <Profile />
      <Stack
        className="body-container"
        verticalFill
        tokens={{ childrenGap: 10 }}
        styles={{ root: { overflowY: "auto", height: "100%" } }}
      >
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Characters
        </Text>
        <CharacterTable />
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Sessions
        </Text>
        <SessionTable />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
