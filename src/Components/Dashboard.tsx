import { useSelector } from "react-redux";
import { Stack, Text } from "@fluentui/react";

const Dashboard = () => {
  const characters = useSelector((state) => state.characters);
  const sessions = useSelector((state) => state.sessions);

  return (
    <Stack>
      <Text>Dashboard</Text>
    </Stack>
  );
};

export default Dashboard;
