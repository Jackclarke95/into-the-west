import { NeutralColors, Stack } from "@fluentui/react";

const CharactersPage = () => {
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

export default CharactersPage;
