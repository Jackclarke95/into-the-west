import { Pivot, PivotItem, Stack } from "@fluentui/react";
import Profile from "./Profile/Profile";
import Utilities from "./Utilities/Utilities";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";

const DesktopDashboard = () => {
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
      <Pivot>
        <PivotItem headerText="Sessions">
          <SessionTable />
        </PivotItem>
        <PivotItem headerText="Characters">
          <CharacterTable />
        </PivotItem>
      </Pivot>
      <Stack>
        <Profile />
        <Utilities />
      </Stack>
    </Stack>
  );
};

export default DesktopDashboard;
