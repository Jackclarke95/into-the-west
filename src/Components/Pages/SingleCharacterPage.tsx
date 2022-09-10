import { DefaultSpacing, Persona, PersonaSize, Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DataHelper from "../../Helpers/DataHelper";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import { ClassIcon } from "../ClassIcon";
import BasePage from "./BasePage";

const SingleCharacterPage = () => {
  const { characterId } = useParams();

  const characters = useSelector((state) => state.characters);

  const character = characters.isLoading
    ? null
    : characters.data.find((character) => character.id === characterId);

  const primaryClass = character?.classes.reduce((currentClass, prevClass) => {
    if (currentClass.level > prevClass.level) {
      return currentClass;
    } else {
      return prevClass;
    }
  }, character.classes[0]);

  const onRenderSecondaryText = () => {
    return (
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        {[...character!.classes]
          .sort((a, b) => b.level - a.level)
          .map((cls) => {
            return (
              <Stack horizontal horizontalAlign="center" verticalAlign="center">
                <ClassIcon
                  className={cls.class}
                  styles={{
                    root: {
                      borderRadius: "50%",
                      marginRight: DefaultSpacing.s2,
                      maxWidth: 24,
                    },
                  }}
                />
                {character!.classes.length > 1
                  ? `${cls.class} (${cls.level})`
                  : cls.class}
              </Stack>
            );
          })}
      </Stack>
    );
  };

  return (
    <BasePage pageTitle={character?.fullName ?? ""}>
      <Stack tokens={{ childrenGap: 20 }}>
        <Persona
          size={PersonaSize.size120}
          imageUrl={character?.avatarUrl ?? DefaultAvatar}
          text={`${DataHelper.formatOrdinalNumber(
            character?.currentLevel ?? 0
          )} level ${
            `${primaryClass?.class} ${
              primaryClass?.subclass ? `(${primaryClass?.subclass})` : ""
            }` ?? "Unknown"
          }`}
          onRenderSecondaryText={onRenderSecondaryText}
        />
      </Stack>
    </BasePage>
  );
};

export default SingleCharacterPage;
