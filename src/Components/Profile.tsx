import {
  DefaultButton,
  FontSizes,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import ActiveCharacter from "./ActiveCharacter";

const Profile = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentUser);
  const isDevMode = useSelector((state) => state.isDevMode);

  const onClickCreateCharacter = () => {
    console.log("creating character");

    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: true,
    });
  };

  const onClickCreateSession = () => {
    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Text
        styles={{
          root: { fontSize: FontSizes.superLarge, textAlign: "start" },
        }}
      >
        Profile
      </Text>
      <Text
        variant="medium"
        styles={{
          root: { fontSize: FontSizes.medium, textAlign: "start" },
        }}
      >{`Welcome back, ${currentUser.friendlyName}`}</Text>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          variant="large"
          styles={{
            root: { fontSize: FontSizes.large, textAlign: "start" },
          }}
        >
          Active Character
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Edit" disabled={characters.isLoading} />
          <DefaultButton text="Retire" disabled={characters.isLoading} />
        </Stack>
      </Stack>
      <ActiveCharacter />
      <PrimaryButton
        text="New character"
        onClick={onClickCreateCharacter}
        disabled={!isDevMode}
      />
      <PrimaryButton
        text="New session"
        onClick={onClickCreateSession}
        disabled={!isDevMode}
      />
    </Stack>
  );
};

export default Profile;
