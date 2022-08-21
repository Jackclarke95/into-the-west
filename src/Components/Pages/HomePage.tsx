import { NeutralColors, Stack } from "@fluentui/react";

const HomePage = () => {
  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      styles={{ root: { backgroundColor: NeutralColors.white, width: 1500 } }}
    >
      Home Page
    </Stack>
  );
};

export default HomePage;
