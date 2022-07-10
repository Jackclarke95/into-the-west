import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";
import { get, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import { db } from "../../App";

const Utilities = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.players);

  const onClickShowTokenCreator = () => {
    console.log("Displaying token creator");

    dispatch({
      type: "SetShowTokenCreatorDialog",
      showTokenCreatorDialog: true,
    });
  };

  const onClickGenerateKey = () => {
    const key = DataService.generateKey();

    if (key) {
      navigator.clipboard.writeText(key);
      console.log(key);
    } else {
      console.log("Failed to generate key");
    }
  };

  const onClickDetermineEvents = async () => {
    const eventsRef = ref(db, "events");
    const eventInterestsRef = ref(db, "eventInterests");
    const availabilitiesRef = ref(db, "availabilities");
    const mapsRef = ref(db, "maps");

    const eventData = await get(eventsRef)
      .then((response) => {
        const data = response.val();

        const events = Object.keys(data).map((key) => {
          const event = data[key];
          event.key = key;
          event.selectedDate = new Date(
            event.selectedDate.replace(/(\d+[/])(\d+[/])/, "$2$1")
          ).getTime();

          return event;
        });

        return events as {
          key: string;
          title: string;
          date: number;
          mapId: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    const eventInterestData = await get(eventInterestsRef)
      .then((response) => {
        const data = response.val();

        const eventInterests = Object.keys(data).map((key) => {
          const eventInterest = data[key];
          eventInterest.key = key;

          if (users.isLoading) {
            console.log("loading user data");

            return;
          }

          const user = users.data.find(
            (user) => user.key === eventInterest.playerId
          );

          eventInterest.user = user;

          return eventInterest;
        });

        return eventInterests as {
          key: string;
          eventId: string;
          playerId: string;
          didAttend: boolean;
          role: number;
        }[];
      })
      .catch((e) => console.error("error", e));

    const availabilityData = await get(availabilitiesRef)
      .then((response) => {
        const data = response.val();

        const availabilities = Object.keys(data).map((key) => {
          const availability = data[key];
          availability.key = key;

          return availability;
        });

        return availabilities as {
          key: string;
          eventInterestId: string;
          date: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    const mapData = await get(mapsRef)
      .then((response) => {
        const data = response.val();

        const maps = Object.keys(data).map((key) => {
          const map = data[key];
          map.key = key;

          return map;
        });

        return maps as {
          key: string;
          name: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    console.log({ eventData });
    console.log("interests", eventInterestData);
    console.log("availabilities", availabilityData);
    console.log("maps", mapData);

    if (eventData && eventInterestData && availabilityData && mapData) {
      const events = eventData.map((event) => {
        const applicableInterests = eventInterestData.filter(
          (eventInterest) => eventInterest.eventId === event.key
        );

        const applicableAvailabilities = availabilityData.filter(
          (availability) =>
            applicableInterests
              .map((interest) => interest.key)
              .includes(availability.eventInterestId)
        );

        if (
          applicableAvailabilities.length > 0 ||
          applicableInterests.length > 0
        ) {
          console.log(event.title, event.key);
          console.log("applicable interests", applicableInterests);
          console.log("applicable availabilities", applicableAvailabilities);
        }
      });

      console.log("mapped events", events);
    }
  };

  const onClickShowNewRaceDialog = () => {
    dispatch({
      type: "SetShowNewRaceDialog",
      showNewRaceDialog: true,
    });
  };

  const onClickShowNewSubraceDialog = () => {
    dispatch({
      type: "SetShowNewSubraceDialog",
      showNewSubraceDialog: true,
    });
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
        Tools
      </Separator>
      <DefaultButton text="Token creator" onClick={onClickShowTokenCreator} />
      <DefaultButton text="Generate key" onClick={onClickGenerateKey} />
      <DefaultButton text="New race" onClick={onClickShowNewRaceDialog} />
      <DefaultButton
        text="New subrace"
        onClick={onClickShowNewSubraceDialog}
        disabled
      />
      <DefaultButton text="Determine events" onClick={onClickDetermineEvents} />
    </Stack>
  );
};

export default Utilities;
