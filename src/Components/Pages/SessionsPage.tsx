import { PrimaryButton, Stack } from "@fluentui/react";
import { useDispatch } from "react-redux";
import SessionTable from "../Tables/SessionTable";
import BasePage from "./BasePage";

const SessionsPage = () => {
  const dispatch = useDispatch();

  const onClickNewSession = () => {
    console.log("Clicked create session");

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  return (
    <BasePage pageTitle="Sessions">
      <Stack
        horizontalAlign="start"
        styles={{ root: { padding: 10 } }}
        horizontal
      >
        <PrimaryButton onClick={onClickNewSession}>New session</PrimaryButton>
      </Stack>
      <SessionTable />
    </BasePage>
  );
};

export default SessionsPage;
