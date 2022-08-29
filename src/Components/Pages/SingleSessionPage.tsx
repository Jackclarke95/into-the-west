import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BasePage from "./BasePage";

const SingleSessionPage = () => {
  const { sessionId } = useParams();

  const sessions = useSelector((state) => state.sessions);

  const session = sessions.isLoading
    ? null
    : sessions.data.find((session) => session.id === sessionId);

  return (
    <BasePage pageTitle={session ? session.name : "Loading..."}>
      <Stack styles={{ root: { marginLeft: 20 } }}></Stack>
    </BasePage>
  );
};

export default SingleSessionPage;
