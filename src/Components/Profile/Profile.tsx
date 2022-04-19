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
  const currentPlayer = useSelector((state) => state.currentPlayer);
  const players = useSelector((state) => state.players);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (players.isLoading || !user) {
      return;
    }

    const currentPlayer = players.data.find(
      (player) => player.email === user.email
    );

    dispatch({
      type: "SetCurrentPlayer",
      currentPlayer: { isLoading: false, data: currentPlayer },
    });
  }, [players]);

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
  }, [currentPlayer]);

  const onClickSignOut = () => {
    DataService.signOut();
  };

  console.log("players", players);

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
      {!currentPlayer.isLoading && currentPlayer.data && (
        <Text
          variant="medium"
          styles={{
            root: { fontSize: FontSizes.large, textAlign: "start" },
          }}
        >{`Welcome back, ${currentPlayer.data.friendlyName}`}</Text>
      )}
      <Separator />
      <ActiveCharacter />
      <Separator />
      <NextSession />
    </Stack>
  );
};

export default Profile;
