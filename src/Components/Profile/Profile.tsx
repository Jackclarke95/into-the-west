import {
  DefaultButton,
  FontSizes,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import ActiveCharacter from "./ActiveCharacter";
import NextSession from "./NextSession";

const Profile = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentUser);

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

  const onClickSignOut = () => {
    DataService.signOut();
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLargePlus, textAlign: "start" },
          }}
        >
          Profile
        </Text>
        <DefaultButton text="Sign Out" onClick={onClickSignOut} />
      </Stack>
      <Text
        variant="medium"
        styles={{
          root: { fontSize: FontSizes.large, textAlign: "start" },
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
