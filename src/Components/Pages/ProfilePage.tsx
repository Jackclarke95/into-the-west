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
      <Text variant="xxLargePlus" styles={{ root: { marginLeft: 20 } }}>
        My Profile
      </Text>
    </Stack>
  );
};

export default ProfilePage;
