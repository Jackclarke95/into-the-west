import { FontSizes, Stack, Text } from "@fluentui/react";

const Header = () => {
  return (
    <Stack className="header-container">
      <Text className="header" styles={{ root: { fontSize: FontSizes.mega } }}>
        Into the West
      </Text>
    </Stack>
  );
};

export default Header;
