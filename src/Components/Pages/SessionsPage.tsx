import SessionTable from "../Tables/SessionTable";
import BasePage from "./BasePage";

const SessionsPage = () => {
  return (
    <BasePage pageTitle="Sessions">
      <SessionTable />
    </BasePage>
  );
};

export default SessionsPage;
