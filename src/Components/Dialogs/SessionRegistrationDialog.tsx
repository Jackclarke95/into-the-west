import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  Stack,
  Text,
  TooltipHost,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import SessionRole from "../../Enums/SessionRole";
import DataService from "../../Helpers/DataService";
import Availability from "../Availability";

const SessionRegistrationDialog = () => {
  const dispatch = useDispatch();

  const sessionRegistration = useSelector((state) => state.sessionRegistration);
  const authUser = useSelector((state) => state.authUser);
  const availabilitiesSelections = useSelector((state) => state.selectedDates);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  const onDismiss = () => {
    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: false },
    });
  };

  const onClickRegister = async () => {
    if (!authUser) {
      console.log("No user");

      return;
    }

    if (!sessionRegistration.isShown) {
      console.log("No session");

      return;
    }

    if (currentPlayer.isLoading || !currentPlayer.data) {
      console.log("Player loading or no current player", currentPlayer);

      return;
    }

    console.log(
      "clicked register button",
      sessionRegistration.session.id,
      availabilitiesSelections.map((date) => new Date(date).toDateString())
    );

    await DataService.registerForSession(
      sessionRegistration.session,
      currentPlayer.data,
      SessionRole.Player
    );

    await DataService.updateAvailableDates(authUser, availabilitiesSelections);
  };

  const contentProps = sessionRegistration.isShown
    ? {
        type: DialogType.largeHeader,
        title: sessionRegistration.session.name,
        closeButtonAriaLabel: "Close",
      }
    : undefined;

  const roleOptions: IDropdownOption[] = [
    { key: "player", text: "Player" },
    {
      key: "dungeon-master",
      text: "Dungeon Master",
      disabled:
        !currentPlayer.isLoading && !currentPlayer.data?.isDungeonMaster,
    },
  ];

  return (
    <Dialog
      hidden={!sessionRegistration.isShown}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        <Text>Please confirm your availability</Text>
        <Availability />
        <Dropdown
          label="Role"
          options={roleOptions}
          defaultSelectedKey="player"
        />
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <TooltipHost
            content={
              availabilitiesSelections.length === 0
                ? "Select at least one date to continue"
                : ""
            }
          >
            <PrimaryButton
              text="Register"
              onClick={onClickRegister}
              disabled={availabilitiesSelections.length === 0}
            />
          </TooltipHost>
        </DialogFooter>
      </Stack>
    </Dialog>
  );
};

export default SessionRegistrationDialog;
