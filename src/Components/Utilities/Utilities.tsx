import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";
import { get, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import { db } from "../../App";
import Races from "../../Data/Races";

const Utilities = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);

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

  const onClickDetermineClasses = async () => {
    const classesRef = ref(db, "classes");
    const subclassesRef = ref(db, "subclasses");
    const classConfigsRef = ref(db, "classConfigs");

    const classData = await get(classesRef)
      .then((response) => {
        const data = response.val();

        const classes = Object.keys(data).map((key) => {
          const cls = data[key];
          cls.key = key;

          return cls;
        });

        return classes as {
          name: string;
          archetypeFrom: number;
          archetypeName: string;
          archetypePluralName: string;
          key: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    const subclassData = await get(subclassesRef)
      .then((response) => {
        const data = response.val();

        const subclasses = Object.keys(data).map((key) => {
          const subclass = data[key];
          subclass.key = key;

          return subclass;
        });

        return subclasses as { name: string; key: string }[];
      })
      .catch((e) => console.error("error", e));

    const classConfigData = await get(classConfigsRef)
      .then((response) => {
        const data = response.val();

        const configs = Object.keys(data).map((key) => {
          const config = data[key];
          config.key = key;

          return config;
        });

        return configs as {
          classId: string;
          subclassId: string;
          key: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    if (classData && subclassData && classConfigData) {
      const mappedClasses = classData.map((cls) => {
        const matchedConfigs = classConfigData.filter(
          (config) => config.classId === cls.key
        );

        const subclasses = matchedConfigs.map((config) => {
          return subclassData.find(
            (subclass) => subclass.key === config.subclassId
          );
        });

        return {
          name: cls.name,
          archetypeFrom: cls.archetypeFrom,
          archetypeName: cls.archetypeName,
          archetypePluralName: cls.archetypePluralName,
          key: cls.key,
          subclasses: subclasses,
        };
      });

      console.log("Mapped classes", mappedClasses);
    }
  };

  const onClickDetermineRaces = async () => {
    const racesRef = ref(db, "races");
    const subracesRef = ref(db, "subraces");
    const raceConfigsRef = ref(db, "raceConfigs");

    const raceData = await get(racesRef)
      .then((response) => {
        const data = response.val();

        const races = Object.keys(data).map((key) => {
          const race = data[key];
          race.key = key;

          return race;
        });

        return races as {
          name: string;
          key: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    const subraceData = await get(subracesRef)
      .then((response) => {
        const data = response.val();

        const subraces = Object.keys(data).map((key) => {
          const subrace = data[key];
          subrace.key = key;

          return subrace;
        });

        return subraces as { name: string; key: string }[];
      })
      .catch((e) => console.error("error", e));

    const raceConfigData = await get(raceConfigsRef)
      .then((response) => {
        const data = response.val();

        const configs = Object.keys(data).map((key) => {
          const config = data[key];
          config.key = key;

          return config;
        });

        return configs as {
          raceId: string;
          subraceId: string;
          key: string;
        }[];
      })
      .catch((e) => console.error("error", e));

    if (raceData && subraceData && raceConfigData) {
      const mappedRaces = raceData.map((race) => {
        const matchedConfigs = raceConfigData.filter(
          (config) => config.raceId === race.key
        );

        const subraces = matchedConfigs.map((config) =>
          subraceData.find((subrace) => subrace.key === config.subraceId)
        );

        return {
          name: race.name,
          key: race.key,
          subraces: subraces,
        };
      });

      console.log("Mapped Races", mappedRaces);
    }
  };

  const onClickGenerateRaceData = () => {
    console.log("generating races");

    const subraces = [] as any[];
    const raceConfigs = [] as string[];

    const races = Races.map((race) => {
      const raceKey = DataService.generateKey();

      const hasBaseRace =
        race.subraces?.some((subrace) => subrace === "Base") ?? false;

      const hasSubraces = race.subraces?.some((subrace) => subrace) ?? false;

      const subraceRequired = hasSubraces && !hasBaseRace;

      const generatedRace = `"${raceKey}": { "name": "${race.name}", "subraceRequired": ${subraceRequired} }`;

      race.subraces?.forEach((subrace) => {
        if (subrace === "Base") {
          return;
        }

        const subraceKey = DataService.generateKey();
        const raceConfigKey = DataService.generateKey();

        const generatedSubrace = `"${subraceKey}": { "name": "${subrace}" }`;
        const generatedRaceConfig = `"${raceConfigKey}": { "raceId": "${raceKey}", "subraceid": "${subraceKey}" }`;

        subraces.push(generatedSubrace);
        raceConfigs.push(generatedRaceConfig);
      });

      return generatedRace;
    });

    console.log(races.join(","));
    console.log(subraces.join(","));
    console.log(raceConfigs.join(","));
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

          return event;
        });

        return events as {
          key: string;
          title: string;
          date: string;
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

          const userId = eventInterest.userId;

          const user = users.data.find((user) => user.key === userId);

          console.log(user);

          eventInterest.user = user;

          return eventInterest;
        });

        return eventInterests as {
          key: string;
          eventId: string;
          userId: string;
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

    console.log("events", eventData);
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
      <DefaultButton
        text="Determine classes"
        onClick={onClickDetermineClasses}
      />
      <DefaultButton text="Determine races" onClick={onClickDetermineRaces} />
      <DefaultButton text="Generate races" onClick={onClickGenerateRaceData} />
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
