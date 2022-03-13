import {
  Stack,
  Text,
  FontSizes,
  DocumentCard,
  DocumentCardImage,
  DocumentCardDetails,
  DocumentCardTitle,
  ImageFit,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import "./Style/App.scss";
import { CharacterTable } from "./Components/CharacterTable";
import DefaultAvatar from "./Images/DefaultAvatar.jpeg";

export default () => {
  initializeIcons();

  return (
    <Stack>
      <Stack className="header">
        <Text styles={{ root: { fontSize: FontSizes.mega } }}>
          Into the West
        </Text>
      </Stack>
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        styles={{
          root: {
            width: "100%",
            maxWidth: "100%",
            textAlign: "center",
            height: "100vh",
          },
        }}
      >
        <CharacterTable />
      </Stack>
    </Stack>
  );
};
