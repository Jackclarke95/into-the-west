import { Stack } from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import "./Style/App.scss";
import { CharacterTable } from "./Components/CharacterTable";

export default () => {
  initializeIcons();

  return (
    <Stack
      verticalFill
      horizontal
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
      <CharacterTable />
    </Stack>
  );
};
