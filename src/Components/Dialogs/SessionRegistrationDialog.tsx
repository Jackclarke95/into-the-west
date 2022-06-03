import {
  Checkbox,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Separator,
  Stack,
  Text,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";

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

  const onChangeAvailableDate = (
    date: Date,
    _?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) => {
    console.log(availableDates);

    if (isChecked) {
      // add date to availableDates
      setAvailableDates([...availableDates, date.getTime()]);
    } else {
      // remove date from availableDates
      setAvailableDates(availableDates.filter((d) => d !== date.getTime()));
    }

    console.log(availableDates, date);
  };

  const contentProps = sessionRegistration.isShown
    ? {
        type: DialogType.close,
        title: sessionRegistration.session.name,
        closeButtonAriaLabel: "Close",
      }
    : undefined;

  const getAvailableDates = () => {
    const today = DataHelper.getDateWithoutTime(new Date());

    const nextMonday = new Date(
      today.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1)
    );

    let datesCollection = [] as Date[];

    for (var i = 0; i < 14; i++) {
      const newDate = DataHelper.addDaysToDate(nextMonday, i);

      datesCollection.push(newDate);
    }

    return datesCollection;
  };

  const AvailableWeek = (props) => {
    const dates = props.dates as Date[];

    return (
      <Stack grow tokens={{ childrenGap: 10 }}>
        {dates.map((date) => (
          <Checkbox
            checked={availableDates.includes(date.getTime())}
            label={DataHelper.getDateInDayDateMonthFormat(date)}
            onChange={(ev, checked) => onChangeAvailableDate(date, ev, checked)}
          />
        ))}
      </Stack>
    );
  };

  const AvailableDates = () => {
    const weeks = DataHelper.splitArrayIntoChunks(getAvailableDates(), 2);

    return (
      <Stack tokens={{ childrenGap: 10 }} horizontal>
        <AvailableWeek dates={weeks[0]} />
        <AvailableWeek dates={weeks[1]} />
      </Stack>
    );
  };

  console.log(availableDates);

  return (
    <Dialog
      hidden={!sessionRegistration.isShown}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        <Text>Please select dates that you can attend this session.</Text>
        <AvailableDates />
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
