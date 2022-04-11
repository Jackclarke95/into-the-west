import { FontSizes, Stack, Text } from "@fluentui/react";

export default () => {
  return (
    <Stack className="header-container">
      <Text className="header" styles={{ root: { fontSize: FontSizes.mega } }}>
        Into the West
      </Text>
    </Stack>
  );
};
