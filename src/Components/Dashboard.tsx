import { Stack } from "@fluentui/react";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";
import Profile from "./Profile/Profile";
import Tools from "./Tools/Tools";

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
          padding: "1em",
          backgroundColor: "white",
        },
      }}
    >
      <Stack verticalFill>
        <SessionTable />
        <CharacterTable />
      </Stack>
      <Stack>
        <Profile />
        <Tools />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
