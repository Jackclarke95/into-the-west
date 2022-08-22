import { Stack, Text } from "@fluentui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleSessionPage = () => {
  const { sessionId } = useParams();

  const sessions = useSelector((state) => state.sessions);

  const session = sessions.isLoading
    ? null
    : sessions.data.find((session) => session.id === sessionId);

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
        <Text variant="xxLargePlus">
          {session ? session.name : "Loading..."}
        </Text>
      </Stack>
    </Stack>
  );
};

export default SingleSessionPage;
