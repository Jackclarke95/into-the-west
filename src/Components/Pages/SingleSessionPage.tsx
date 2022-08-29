import { DefaultButton, PrimaryButton, Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataService from "../../Helpers/DataService";
import BasePage from "./BasePage";

const SingleSessionPage = () => {
  const dispatch = useDispatch();
  const { sessionId } = useParams();

  const sessions = useSelector((state) => state.sessions);
  const currentPlayer = useSelector((state) => state.currentPlayer);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  const session = sessions.isLoading
    ? null
    : sessions.data.find((session) => session.id === sessionId);

  const playerInterestInSession =
    sessionInterests.isLoading || currentPlayer.isLoading || !session
      ? undefined
      : sessionInterests.data.find(
          (interest) =>
            interest.playerId === currentPlayer.data?.id &&
            interest.sessionId === session.id
        );

  const playerIsInterested = !!playerInterestInSession;

  const onClickSignUp = () => {
    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: true, session: session! },
    });
  };

  const onClickSetDate = () => {
    console.log("Clicked set date");
  };

  const onClickCompleteSession = () => {
    console.log("Clicked complete session");
  };

  const onClickRemoveFromSession = async () => {
    if (!playerInterestInSession) {
      return;
    }

    dispatch({
      type: "SetConfirmation",
      confirmation: {
        isShown: true,
        message: "Are you sure you wish to unregister from this session?",
        onConfirm: async () =>
          await DataService.unregisterFromSession(playerInterestInSession),
      },
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
        {!playerIsInterested && (
          <PrimaryButton text="Sign Up" onClick={onClickSignUp} />
        )}
        {playerIsInterested && (
          <PrimaryButton text="Unregister" onClick={onClickRemoveFromSession} />
        )}
        <DefaultButton text="Set date" onClick={onClickSetDate} />
        <DefaultButton
          text="Complete session"
          onClick={onClickCompleteSession}
        />
      </Stack>
    </BasePage>
  );
};

export default SingleSessionPage;
