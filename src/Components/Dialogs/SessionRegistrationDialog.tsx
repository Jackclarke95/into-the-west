import {
  Checkbox,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";
import Availability from "../Availability";

const SessionRegistrationDialog = () => {
  const dispatch = useDispatch();

  const sessionRegistration = useSelector((state) => state.sessionRegistration);
  const authUser = useSelector((state) => state.authUser);

  const [availableDates, setAvailableDates] = useState([] as number[]);

  const onDismiss = () => {
    setAvailableDates([]);

    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: false },
    });
  };

  const onClickRegister = () => {
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
      availableDates.map((date) => new Date(date).toDateString())
    );

    DataService.registerForSession(
      authUser,
      sessionRegistration.session,
      availableDates.map((date) => new Date(date))
    );
  };

  const contentProps = sessionRegistration.isShown
    ? {
        type: DialogType.close,
        title: sessionRegistration.session.name,
        closeButtonAriaLabel: "Close",
      }
    : undefined;

  console.log(availableDates);

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
            disabled={availableDates.length === 0}
          />
        </DialogFooter>
      </Stack>
    </Dialog>
  );
};

export default SessionRegistrationDialog;
