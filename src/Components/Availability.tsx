import { Stack, Checkbox, Separator, Text, FontSizes } from "@fluentui/react";
import { useState } from "react";
import DataHelper from "../Helpers/DataHelper";

const Availability = () => {
  const [availableDates, setAvailableDates] = useState<number[]>([]);

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

  const getAvailableDates = (days: number) => {
    const today = DataHelper.getDateWithoutTime(new Date());

    const nextMonday = new Date(
      today.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1)
    );

    let datesCollection = [] as Date[];

    for (var i = 0; i < days; i++) {
      const newDate = DataHelper.addDaysToDate(nextMonday, i);

      datesCollection.push(newDate);
    }

    return datesCollection;
  };

  const AvailableWeek = (props) => {
    const dates = props.dates as Date[];

    return (
      <Stack>
        <Stack horizontal tokens={{ childrenGap: 5 }} horizontalAlign="center">
          {dates.map((date) => (
            <Stack
              horizontalAlign="center"
              tokens={{ childrenGap: 3 }}
              styles={{ root: { display: "flex" } }}
            >
              <Text styles={{ root: { fontWeight: 500 } }}>
                {date.toLocaleString("default", { weekday: "short" })[0]}
              </Text>
              <Text variant="small">
                {`${date.getDate()}/${date.getMonth() + 1}`}
              </Text>
              <Checkbox
                checked={availableDates.includes(date.getTime())}
                onChange={(ev, checked) =>
                  onChangeAvailableDate(date, ev, checked)
                }
                styles={{ root: { marginLeft: "4px" } }}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  };

  const days = 21;
  const chunkSize = 7;

  const weeks = DataHelper.sliceArrayIntoChunks(
    getAvailableDates(days),
    chunkSize
  );

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      {weeks.map((week, index) => {
        return (
          <Stack>
            <Separator styles={{ root: { fontSize: FontSizes.mediumPlus } }}>
              {`Week ${index + 1}`}
            </Separator>
            <AvailableWeek dates={week} />
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Availability;
