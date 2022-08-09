import {
  Checkbox,
  DatePicker,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SessionRole from "../../../Enums/SessionRole";
import DataService from "../../../Helpers/DataService";
import { Character } from "../../../Types/LocalStructures";

const SessionCompletionDialog = () => {
  const dispatch = useDispatch();

  const sessionCompletion = useSelector((state) => state.sessionCompletion);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  const [selectedAttendees, setSelectedAttendees] = useState<Character[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (!sessionCompletion.isShown) {
      return;
    }

    setSelectedDate(sessionCompletion.session.date);
  }, [sessionCompletion]);

  const onDismiss = () => {
    dispatch({
      type: "SetSessionCompletion",
      sessionCompletion: { isShown: false },
    });
  };

  const dialogContentProps: IDialogContentProps | undefined =
    sessionCompletion.isShown
      ? {
          type: DialogType.largeHeader,
          title: "Complete session",
          closeButtonAriaLabel: "Close",
        }
      : undefined;

  const onClickComplete = () => {
    if (
      !sessionCompletion.isShown ||
      sessionInterests.isLoading ||
      !selectedDate
    ) {
      return;
    }

    const applicableSessionInterests = sessionInterests.data.filter(
      (sessionInterest) =>
        sessionInterest.sessionId === sessionCompletion.session.id &&
        sessionInterest.role === SessionRole.Player &&
        selectedAttendees
          .map((attendee) => attendee.player?.id)
          .includes(sessionInterest.playerId)
    );

    try {
      applicableSessionInterests.forEach((interest) => {
        DataService.setInterestAttendance(interest.key, true);
      });
    } catch (error) {
      toast.error(`${error}`);
    }

    DataService.completeSession(sessionCompletion.session.id, selectedDate)
      .then(() => {
        toast.success(`Session completed`);
      })
      .catch((error) => {
        toast.error(`${error}`);
      });

    onDismiss();
  };

  const attendees = sessionCompletion.isShown
    ? sessionCompletion.session.attendees.interested
    : [];

  const onSelectAttendee = (
    isChecked: boolean | undefined,
    character: Character
  ) => {
    if (isChecked) {
      setSelectedAttendees([...selectedAttendees, character]);
    } else {
      setSelectedAttendees(
        selectedAttendees.filter((attendee) => attendee.id !== character.id)
      );
    }
  };

  const onChangeSelectedDate = (date: Date | null | undefined) => {
    if (date) {
      setSelectedDate(date.getTime());
    }
  };

  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={!sessionCompletion.isShown}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text>
          Please select the characters who attended this session, and confirm
          the session date.
        </Text>
        <Stack tokens={{ childrenGap: 10 }}>
          {attendees.map((character) => (
            <Checkbox
              label={character.fullName}
              onChange={(_, isChecked) =>
                onSelectAttendee(isChecked, character)
              }
            />
          ))}
        </Stack>
        <DatePicker
          isMonthPickerVisible={false}
          label="Date"
          value={selectedDate ? new Date(selectedDate) : undefined}
          onSelectDate={onChangeSelectedDate}
        />
      </Stack>
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton
          text="Complete"
          onClick={onClickComplete}
          disabled={selectedAttendees.length === 0 || !selectedDate}
        />
      </DialogFooter>
    </Dialog>
  );
};

export default SessionCompletionDialog;
