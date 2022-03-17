import { FontSizes, Stack, Text } from "@fluentui/react";

export const Footer = () => {
  return (
    <Stack className="footer-container">
      <Text className="footer" styles={{ root: { fontSize: FontSizes.large } }}>
        Footer
      </Text>
    </Stack>
  );
};
