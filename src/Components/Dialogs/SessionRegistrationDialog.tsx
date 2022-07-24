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
import { useEffect, useState } from "react";
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

  const [interestedRole, setInterestedRole] = useState<SessionRole | undefined>(
    undefined
  );
  const [playerIsDungeonMaster, setPlayerIsDungeonMaster] =
    useState<boolean>(false);

  useEffect(() => {
    if (!currentPlayer) {
      setPlayerIsDungeonMaster(false);

      return;
    }

    const playerIsDungeonMaster =
      !currentPlayer.isLoading && !!currentPlayer.data?.isDungeonMaster;

    setPlayerIsDungeonMaster(playerIsDungeonMaster);
  }, [currentPlayer]);

  useEffect(() => {
    if (!playerIsDungeonMaster) {
      setInterestedRole(SessionRole.Player);

      return;
    }

    setInterestedRole(undefined);
  }, [playerIsDungeonMaster]);

  const onDismiss = () => {
    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: false },
    });
  };

  const onClickRegister = async () => {
    if (
      currentPlayer.isLoading ||
      !authUser ||
      !sessionRegistration.isShown ||
      !currentPlayer.data ||
      !interestedRole
    ) {
      return;
    }

    await DataService.registerForSession(
      sessionRegistration.session,
      currentPlayer.data,
      interestedRole
    );

    await DataService.updateAvailableDates(authUser, availabilitiesSelections);

    onDismiss();
  };

  const onChangeSessionRole = (
    _: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption | undefined
  ) => {
    if (!option) {
      setInterestedRole(undefined);

      return;
    }

    setInterestedRole(SessionRole[option.key] as SessionRole);
  };

  const contentProps = sessionRegistration.isShown
    ? {
        type: DialogType.largeHeader,
        title: sessionRegistration.session.name,
        closeButtonAriaLabel: "Close",
      }
    : undefined;

  const roleOptions: IDropdownOption[] = [
    { key: SessionRole.Player, text: SessionRole[SessionRole.Player] },
    {
      key: SessionRole["Dungeon Master"],
      text: SessionRole[SessionRole["Dungeon Master"]],
      disabled:
        !currentPlayer.isLoading && !currentPlayer.data?.isDungeonMaster,
    },
  ];

  const getRegisterDisabledTooltipContent = () => {
    if (availabilitiesSelections.length === 0) {
      return "Select at least one date to continue.";
    }

    if (!interestedRole) {
      return "Please select a role to continue.";
    }
  };

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
          required
          onChange={onChangeSessionRole}
        />
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <TooltipHost content={getRegisterDisabledTooltipContent()}>
            <PrimaryButton
              text="Register"
              onClick={onClickRegister}
              disabled={
                availabilitiesSelections.length === 0 || !interestedRole
              }
            />
          </TooltipHost>
        </DialogFooter>
      </Stack>
    </Dialog>
  );
};

export default SessionRegistrationDialog;
