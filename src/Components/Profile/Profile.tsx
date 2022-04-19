import {
  DefaultButton,
  FontSizes,
  Image,
  ImageFit,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import ActiveCharacter from "./ActiveCharacter";
import NextSession from "./NextSession";

const Profile = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentUser);
  const user = useSelector((state) => state.user);

  useEffect(() => {}, [currentUser]);

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

  const users = useSelector((state) => state.users);
  console.log("users", users);

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
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Sign Out" onClick={onClickSignOut} />
          {user && user.photoURL && (
            <Image
              width={32}
              src={user!.photoURL!}
              imageFit={ImageFit.cover}
              styles={{ root: { borderRadius: "50%" } }}
            />
          )}
        </Stack>
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
