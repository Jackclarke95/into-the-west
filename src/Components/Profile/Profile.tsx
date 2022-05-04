import {
  DefaultButton,
  FontSizes,
  IContextualMenuProps,
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

  const onClickAccountNameManagement = () => {
    dispatch({
      type: "SetShowAccountNameManagementDialog",
      showAccountNameManagementDialog: true,
    });
  };

  const onClickPasswordManagement = () => {
    dispatch({
      type: "SetShowPasswordManagementDialog",
      showPasswordManagementDialog: true,
    });
  };

  const onClickSignOut = () => {
    DataService.signOut();
  };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: "manageAccount",
        text: "Manage account",
        iconProps: { iconName: "AccountManagement" },
        onClick: onClickAccountNameManagement,
      },
      {
        key: "changePassword",
        text: "Change password",
        iconProps: { iconName: "PasswordField" },
        onClick: onClickPasswordManagement,
      },
      {
        key: "signOut",
        text: "Sign out",
        iconProps: { iconName: "SignOut" },
        onClick: onClickSignOut,
      },
    ],
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
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Account" split menuProps={menuProps} />
        </Stack>
      </Stack>
      {!currentPlayer.isLoading && currentPlayer.data && (
        <Text
          variant="medium"
          styles={{
            root: { fontSize: FontSizes.large, textAlign: "start" },
          }}
        >{`Welcome back, ${currentPlayer.data.name}`}</Text>
      )}
      <Separator />
      <ActiveCharacter />
      <Separator />
      <NextSession />
    </Stack>
  );
};

export default Profile;
