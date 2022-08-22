import { Stack, Text } from "@fluentui/react";
import SessionTable from "../Tables/SessionTable";

const SessionsPage = () => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          overflowY: "auto",
        },
      }}
    >
      <Text variant="xxLargePlus" styles={{ root: { marginLeft: 20 } }}>
        Sessions
      </Text>
      <SessionTable />
    </Stack>
  );
};

export default SessionsPage;
