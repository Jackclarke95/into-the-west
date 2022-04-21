import { Stack } from "@fluentui/react";
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
      styles={{
        root: {
          overflowY: "auto",
          height: "100%",
          width: "100%",
          paddingTop: 10,
        },
      }}
    >
      <Stack verticalFill>
        <SessionTable />
        <CharacterTable />
      </Stack>
      <Profile />
    </Stack>
  );
};

export default Dashboard;
