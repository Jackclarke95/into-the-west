import {
  DefaultButton,
  FontSizes,
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
  const currentPlayer = useSelector((state) => state.currentPlayer);

  // Set the active character based on the current player
  useEffect(() => {
    if (
      characters.isLoading ||
      currentPlayer.isLoading ||
      !currentPlayer.data
    ) {
      dispatch({
        type: "SetActiveCharacter",
        activeCharacter: { isLoading: true },
      });

      return;
    }

    const activeCharacter = characters.data.find(
      (character) =>
        character.playerDndBeyondName === currentPlayer.data!.dndBeyondName &&
        !character.retirement
    );

    dispatch({
      type: "SetActiveCharacter",
      activeCharacter: { isLoading: false, data: activeCharacter },
    });
  }, [currentPlayer, characters, dispatch]);

  const onClickSignOut = () => {
    DataService.signOut();
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Separator
        styles={{
          root: {
            fontSize: FontSizes.xLargePlus,
          },
        }}
      >
        Profile
      </Separator>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        {!currentPlayer.isLoading && currentPlayer.data && (
          <Text
            variant="medium"
            styles={{
              root: { fontSize: FontSizes.large, textAlign: "start" },
            }}
          >{`Welcome back, ${currentPlayer.data.name}`}</Text>
        )}
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Sign Out" onClick={onClickSignOut} />
        </Stack>
      </Stack>
      <Separator />
      <ActiveCharacter />
      <Separator />
      <NextSession />
    </Stack>
  );
};

export default Profile;
