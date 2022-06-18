import {
  Stack,
  Text,
  Calendar,
  DayOfWeek,
  FontWeights,
  NeutralColors,
  useTheme,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../Helpers/DataHelper";

const Availability = (props: { weeksToRender: number }) => {
  const dispatch = useDispatch();

  const selectedDates = useSelector((state) => state.selectedDates);

  const theme = useTheme();

  const onChangeAvailableDate = (
    selectedDate: Date,
    _?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) => {
    if (isChecked!! && !selectedDates.includes(selectedDate.getTime())) {
      dispatch({
        type: "SetSelectedDates",
        selectedDates: [...selectedDates, selectedDate.getTime()],
      });
    } else {
      dispatch({
        type: "SetSelectedDates",
        selectedDates: selectedDates.filter(
          (date) => date !== selectedDate.getTime()
        ),
      });
    }
  };

  const getAvailableDates = (weeks: number) => {
    const today = DataHelper.getDateWithoutTime(new Date());

    const nextMonday = new Date(
      today.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1)
    );

    let datesCollection = [] as Date[];

    for (var i = 0; i < weeks * 7; i++) {
      const newDate = DataHelper.addDaysToDate(nextMonday, i);

      datesCollection.push(newDate);
    }

    return datesCollection;
  };

  const Day = (props: { date: Date }) => {
    const date = props.date as Date;
    const dateIsInPast = DataHelper.isDateInPast(date);
    const dateIsToday =
      DataHelper.getDateWithoutTime(new Date()).getTime() === date.getTime();
    console.log({ dateIsToday });
    const dateInCurrentMonth = DataHelper.isDateInCurrenttMonth(date);

    const dateIsSelected = selectedDates.includes(date.getTime());

    const getFontWeight = () => {
      if (dateIsToday) {
        return FontWeights.bold;
      } else if (dateIsInPast || !dateInCurrentMonth) {
        return FontWeights.light;
      } else {
        return FontWeights.semibold;
      }
    };

    const getFontColour = () => {
      if (dateIsToday) {
        return NeutralColors.white;
      } else if (dateIsInPast) {
        return NeutralColors.gray100;
      } else {
        return NeutralColors.black;
      }
    };

    const getBackgroundColour = () => {
      if (dateIsToday) {
        return theme.palette.accent;
      } else if (dateIsSelected) {
        return theme.palette.themeLight;
      } else {
        return NeutralColors.white;
      }
    };

    return (
      <Stack
        className="day"
        horizontalAlign="center"
        styles={{
          root: {
            padding: 5,
            display: "flex",
            cursor: dateIsInPast ? "default" : "pointer",
            minWidth: 30,
            minHeight: 30,
            backgroundColor: getBackgroundColour(),
            borderRadius: "50%",
          },
        }}
        onClick={
          dateIsInPast
            ? () => console.log("date in past")
            : () => onChangeAvailableDate(date, undefined, true)
        }
      >
        <Text
          variant="small"
          styles={{
            root: {
              fontWeight: getFontWeight(),
              color: getFontColour(),
            },
          }}
        >
          {date.getDate()}
        </Text>
      </Stack>
    );
  };

  const Week = (props: { weekOfDates: Date[] }) => {
    const dates = props.weekOfDates as Date[];

    return (
      <Stack
        className="week"
        horizontal
        tokens={{ childrenGap: 5 }}
        horizontalAlign="space-around"
      >
        {dates.map((date) => (
          <Day date={date} />
        ))}
      </Stack>
    );
  };

  const Month = () => {
    const weeksToRender = DataHelper.getFullWeeksOfMonth(new Date());

    console.log(weeksToRender);

    return (
      <Stack tokens={{ childrenGap: 15 }}>
        {weeksToRender.map((week) => (
          <Week weekOfDates={week} />
        ))}
      </Stack>
    );
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Month />
      <Calendar
        showMonthPickerAsOverlay
        minDate={new Date()}
        firstDayOfWeek={DayOfWeek.Monday}
      />
    </Stack>
  );
};

export default Availability;
