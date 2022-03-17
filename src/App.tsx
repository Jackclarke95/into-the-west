import { Stack } from "@fluentui/react";
import "./Style/App.scss";
import { CharacterTable } from "./Components/CharacterTable";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { SessionTable } from "./Components/SessionTable";

export default () => {
  return (
    <Stack
      verticalFill
      className="app-container"
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          maxWidth: "100%",
          textAlign: "center",
          height: "100vh",
        },
      }}
      tokens={{ childrenGap: 20 }}
    >
      <Header />
      <Stack
        className="body-container"
        verticalFill
        horizontal
        tokens={{ childrenGap: 35 }}
        styles={{ root: { overflow: "auto" } }}
      >
        <CharacterTable />
        <SessionTable />
      </Stack>
      <Footer />
    </Stack>
  );
};
