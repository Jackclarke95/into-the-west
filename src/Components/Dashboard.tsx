import { FontSizes, Stack, Text } from "@fluentui/react";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";
import Profile from "./Profile/Profile";

const Dashboard = () => {
  return (
    <Stack
      verticalFill
      horizontal
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{ root: { overflowY: "auto", height: "100%", width: "100%" } }}
    >
      <Profile />
      <Stack
        verticalFill
        tokens={{ childrenGap: 10 }}
        styles={{ root: { overflowY: "auto", height: "100%" } }}
      >
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Sessions
        </Text>
        <SessionTable />
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Characters
        </Text>
        <CharacterTable />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
