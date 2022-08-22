import { Stack, Text } from "@fluentui/react";

const ProfilePage = () => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          overflowY: "scroll",
        },
      }}
    >
      <Stack styles={{ root: { marginLeft: 20 } }}>
        <Text variant="xxLargePlus">My Profile</Text>
      </Stack>
    </Stack>
  );
};

export default ProfilePage;
