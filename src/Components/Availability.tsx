import {
  Stack,
  Text,
  Calendar,
  DayOfWeek,
  FontWeights,
  NeutralColors,
  useTheme,
  IconButton,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../Helpers/DataHelper";

const Availability = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const selectedDates = useSelector((state) => state.selectedDates);

  const [firstDateOfMonthToRender, setFirstDateOfMonthToRender] =
    useState<Date>(DataHelper.getFirstDayOfMonth(new Date()));

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

  const Day = (props: { date: Date }) => {
    const [hover, setHover] = useState(false);

    const date = props.date as Date;
    const dateIsInPast = DataHelper.isDateInPast(date);
    const dateIsToday =
      DataHelper.getDateWithoutTime(new Date()).getTime() === date.getTime();
    const dateInCurrentMonth = DataHelper.isDateInMonth(
      date,
      firstDateOfMonthToRender
    );

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
      if (dateIsInPast) {
        return NeutralColors.white;
      } else if (dateIsSelected) {
        return hover ? NeutralColors.gray50 : NeutralColors.gray30;
      } else {
        return hover ? NeutralColors.gray20 : NeutralColors.white;
      }
    };

    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        styles={{
          root: {
            width: 28,
            height: 28,
            backgroundColor: getBackgroundColour(),
            border: dateIsSelected ? "1px solid " + NeutralColors.black : "",
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={
          dateIsInPast
            ? () => console.log("date in past")
            : () => onChangeAvailableDate(date, undefined, true)
        }
      >
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{
            root: {
              padding: 5,
              display: "flex",
              cursor: dateIsInPast ? "default" : "pointer",
              width: 24,
              height: 24,
              backgroundColor: dateIsToday ? theme.palette.accent : undefined,
              borderRadius: "50%",
            },
          }}
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
      </Stack>
    );
  };

  const Week = (props: { weekOfDates: Date[] }) => {
    const dates = props.weekOfDates as Date[];

    return (
      <Stack
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
    const weeksToRender = DataHelper.getFullWeeksOfMonth(
      firstDateOfMonthToRender
    );

    return (
      <Stack tokens={{ childrenGap: 7 }}>
        {weeksToRender.map((week) => (
          <Week weekOfDates={week} />
        ))}
      </Stack>
    );
  };

  const onClickPreviousMonth = () => {
    setFirstDateOfMonthToRender(
      DataHelper.decrementMonth(firstDateOfMonthToRender)
    );
  };

  const onClickNextMonth = () => {
    setFirstDateOfMonthToRender(
      DataHelper.incrementMonth(firstDateOfMonthToRender)
    );
  };

  console.log(firstDateOfMonthToRender);

  return (
    <Stack>
      <Stack horizontal horizontalAlign="space-between">
        <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>
          {firstDateOfMonthToRender.toLocaleString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Stack horizontalAlign="end" horizontal>
          <IconButton
            iconProps={{ iconName: "Up" }}
            onClick={onClickPreviousMonth}
            disabled={DataHelper.isDateInPast(firstDateOfMonthToRender)}
            styles={{ rootDisabled: { backgroundColor: NeutralColors.white } }}
          />
          <IconButton
            iconProps={{ iconName: "Down" }}
            onClick={onClickNextMonth}
            styles={{ icon: { color: NeutralColors.black } }}
          />
        </Stack>
      </Stack>
      <Month />
    </Stack>
  );
};

export default Availability;
