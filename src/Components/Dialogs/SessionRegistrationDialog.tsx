import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import Availability from "../Availability";

const SessionRegistrationDialog = () => {
  const dispatch = useDispatch();

  const sessionRegistration = useSelector((state) => state.sessionRegistration);
  const authUser = useSelector((state) => state.authUser);
  const availabilitiesSelections = useSelector((state) => state.selectedDates);

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

    console.log(
      "clicked register button",
      sessionRegistration.session.key,
      availabilitiesSelections.map((date) => new Date(date).toDateString())
    );

    await DataService.updateAvailableDates(authUser, availabilitiesSelections);

    DataService.registerForSession(
      authUser,
      availabilitiesSelections,
      sessionRegistration.session
    );
  };

  const contentProps = sessionRegistration.isShown
    ? {
        type: DialogType.close,
        title: sessionRegistration.session.name,
        closeButtonAriaLabel: "Close",
      }
    : undefined;

  return (
    <Dialog
      hidden={!sessionRegistration.isShown}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        <Text>Please confirm your availability</Text>
        <Availability />
        <DialogFooter>
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <PrimaryButton
            text="Register"
            onClick={onClickRegister}
            disabled={availabilitiesSelections.length === 0}
          />
        </DialogFooter>
      </Stack>
    </Dialog>
  );
};

export default SessionRegistrationDialog;
