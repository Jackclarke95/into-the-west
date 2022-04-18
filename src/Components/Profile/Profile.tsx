import {
  FontSizes,
  PrimaryButton,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveCharacter from "./ActiveCharacter";
import NextSession from "./NextSession";

const Profile = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentUser);
  const isDevMode = useSelector((state) => state.isDevMode);

  useEffect(() => {
    if (characters.isLoading) {
      dispatch({
        type: "SetActiveCharacter",
        activeCharacter: { isLoading: true },
      });

      return;
    }

    const activeCharacter = characters.data.find(
      (character) =>
        character.playerDndBeyondName === currentUser.dndBeyondName &&
        !character.retirement
    );

    dispatch({
      type: "SetActiveCharacter",
      activeCharacter: { isLoading: false, data: activeCharacter },
    });
  }, [characters, currentUser, dispatch]);

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
          root: { fontSize: FontSizes.xLargePlus, textAlign: "start" },
        }}
      >{`Welcome back, ${currentUser.friendlyName}`}</Text>
      <Separator />
      <ActiveCharacter />
      <Separator />
      <NextSession />
    </Stack>
  );
};

export default Profile;
