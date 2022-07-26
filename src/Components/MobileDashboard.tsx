import { Pivot, PivotItem, Stack } from "@fluentui/react";
import MobileCharacterList from "./MobileCharacterList";
import MobileSessionList from "./MobileSessionList";

const MobileDashboard = () => {
  return (
    <Stack
      horizontalAlign="center"
      styles={{
        root: {
          overflowY: "auto",
          height: "100vh",
          width: "100vw",
        },
      }}
    >
      <Pivot>
        <PivotItem headerText="Sessions">
          <MobileSessionList />
        </PivotItem>
        <PivotItem headerText="Characters">
          <MobileCharacterList />
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default MobileDashboard;
