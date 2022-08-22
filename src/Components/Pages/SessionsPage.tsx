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
      <Text variant="xxLarge">Sessions</Text>
      <SessionTable />
    </Stack>
  );
};

export default SessionsPage;
