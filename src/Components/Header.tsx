import { FontSizes, Stack, Text } from "@fluentui/react";

const Header = () => {
  return (
    <Stack>
      <Text styles={{ root: { fontSize: FontSizes.superLarge } }}>
        Into the West
      </Text>
    </Stack>
  );
};

export default Header;
