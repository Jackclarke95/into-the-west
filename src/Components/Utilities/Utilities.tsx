import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";
import { get, ref } from "firebase/database";
import { useDispatch } from "react-redux";
import DataService from "../../Helpers/DataService";
import { db } from "../../App";

const Utilities = () => {
  const dispatch = useDispatch();

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

    console.log("classData", classData);
    console.log("subclassData", subclassData);
    console.log("classConfigData", classConfigData);

    if (classData && subclassData && classConfigData) {
      const mappedClasses = classData.map((cls) => {
        const matchedConfigs = classConfigData.filter(
          (config) => config.classId === cls.key
        );

        const subclasses = matchedConfigs.map((config) => {
          return subclassData.find((sub) => sub.key === config.subclassId)
            ?.name;
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

      console.log("mappedClasses", mappedClasses);
    }
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
    </Stack>
  );
};

export default Utilities;
