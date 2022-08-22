import { Stack, Text } from "@fluentui/react";

const ProfilePage = () => {
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
      <Text variant="xxLarge">Profile Page</Text>
    </Stack>
  );
};

export default ProfilePage;
