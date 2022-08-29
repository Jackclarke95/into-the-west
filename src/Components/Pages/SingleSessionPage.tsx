import { DefaultButton, PrimaryButton, Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BasePage from "./BasePage";

const SingleSessionPage = () => {
  const dispatch = useDispatch();
  const { sessionId } = useParams();

  const sessions = useSelector((state) => state.sessions);

  const session = sessions.isLoading
    ? null
    : sessions.data.find((session) => session.id === sessionId);

  const onClickSignUp = () => {
    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: true, session: session! },
    });
  };

  return (
    <BasePage pageTitle={session ? session.name : "Loading..."}>
      <Stack
        horizontalAlign="start"
        horizontal
        styles={{ root: { padding: 10 } }}
        tokens={{ childrenGap: 10 }}
      >
        <PrimaryButton onClick={onClickSignUp}>Sign up</PrimaryButton>
        <DefaultButton onClick={onClickSignUp}>Set date</DefaultButton>
        <DefaultButton onClick={onClickSignUp}>Complete session</DefaultButton>
      </Stack>
    </BasePage>
  );
};

export default SingleSessionPage;
