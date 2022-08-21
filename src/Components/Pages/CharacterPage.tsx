import { NeutralColors, Stack } from "@fluentui/react";

const CharacterPage = () => {
  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      styles={{ root: { backgroundColor: NeutralColors.white, width: 1500 } }}
    >
      Characters Page
    </Stack>
  );
};

export default CharacterPage;
