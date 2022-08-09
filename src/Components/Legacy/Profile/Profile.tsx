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
import DataHelper from "../../../Helpers/DataHelper";
import DataService from "../../../Helpers/DataService";
import ActiveCharacter from "./ActiveCharacter";
import UpcomingSessions from "./UpcomingSessions";

const Profile = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentPlayer);

  // Set the active character based on the current player
  useEffect(() => {
    if (characters.isLoading || currentUser.isLoading || !currentUser.data) {
      dispatch({
        type: "SetActiveCharacter",
        activeCharacter: { isLoading: true },
      });

      return;
    }

    const activeCharacter = characters.data.find(
      (character) =>
        character.player?.id === currentUser.data!.id && !character.retirement
    );

    dispatch({
      type: "SetActiveCharacter",
      activeCharacter: { isLoading: false, data: activeCharacter },
    });
  }, [currentUser, characters, dispatch]);

  useEffect(() => {
    if (currentUser.isLoading || !currentUser.data) {
      dispatch({
        type: "SetSelectedDates",
        selectedDates: [] as number[],
      });

      return;
    }

    const selectedDates = currentUser.data.availableDates
      ? currentUser.data.availableDates
          .filter((date) => {
            return !DataHelper.isDateInPast(new Date(date));
          })
          .map((date) => date)
      : [];

    dispatch({
      type: "SetSelectedDates",
      selectedDates: selectedDates,
    });
  }, [currentUser, dispatch]);

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
        {!currentUser.isLoading && currentUser.data && (
          <Text
            variant="medium"
            styles={{
              root: { fontSize: FontSizes.large, textAlign: "start" },
            }}
          >{`Welcome back, ${currentUser.data.name}`}</Text>
        )}
        <DefaultButton text="Account" split menuProps={menuProps} />
      </Stack>
      <Separator />
      <ActiveCharacter />
      <Separator />
      <UpcomingSessions />
    </Stack>
  );
};

export default Profile;
