import { Stack, Text } from "@fluentui/react";
import { useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";

const HomePage = () => {
  const sessions = useSelector((state) => state.sessions);

  const upcomingSessions = sessions.isLoading
    ? []
    : sessions.data
        .filter(
          (session) => !session.date || !DataHelper.isDateInPast(session.date)
        )
        .map((session) => session.name)
        .join(", ");

  return (
    <Stack
      verticalFill
      styles={{
        root: {
          overflowY: "scroll",
        },
      }}
    >
      <Stack styles={{ root: { marginLeft: 20 } }}>
        <Text variant="xxLargePlus">Home Page</Text>
        {upcomingSessions}
      </Stack>
    </Stack>
  );
};

export default HomePage;
