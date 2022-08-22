import { Stack, Text } from "@fluentui/react";

const HomePage = () => {
  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      styles={{
        root: {
          overflowY: "scroll",
        },
      }}
    >
      <Text variant="xxLarge">Home Page</Text>
    </Stack>
  );
};

export default HomePage;
