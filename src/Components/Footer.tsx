import { useSelector } from "react-redux";
import { FontSizes, Stack, Text } from "@fluentui/react";

export default () => {
  const isDevMode = useSelector((state) => state.isDevMode);

  console.log(isDevMode);
  return (
    <Stack className="footer-container" horizontal>
      <Text className="footer" styles={{ root: { fontSize: FontSizes.large } }}>
        Development Mode: {isDevMode.toString()}
      </Text>
    </Stack>
  );
};
