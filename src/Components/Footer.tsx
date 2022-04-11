import { FontSizes, Stack, Text } from "@fluentui/react";

export default () => {
  return (
    <Stack className="footer-container">
      <Text className="footer" styles={{ root: { fontSize: FontSizes.large } }}>
        Footer
      </Text>
    </Stack>
  );
};
