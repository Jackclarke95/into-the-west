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
      horizontalAlign="center"
      styles={{
        root: {
          overflowY: "scroll",
        },
      }}
    >
      <Text variant="xxLargePlus" styles={{ root: { marginLeft: 20 } }}>
        Home Page
      </Text>
      {upcomingSessions}
    </Stack>
  );
};

export default HomePage;
