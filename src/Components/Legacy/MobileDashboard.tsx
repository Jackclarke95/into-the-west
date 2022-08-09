import { Pivot, PivotItem, Stack } from "@fluentui/react";
import MobileCharacterList from "./MobileCharacterList";
import MobileSessionList from "./MobileSessionList";

const MobileDashboard = () => {
  return (
    <Stack horizontalAlign="center">
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
