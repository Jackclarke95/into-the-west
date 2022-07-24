import { DefaultSpacing, Persona, PersonaSize, Stack } from "@fluentui/react";
import DataHelper from "../../Helpers/DataHelper";
import { Character } from "../../Types/LocalStructures";
import { ClassIcon } from "../ClassIcon";

const CharacterCard: React.FC<{
  character: Character;
}> = ({ character }) => {
  const onRenderClasses = () => (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{
        root: { padding: 0, maxHeight: "23px", boxShadow: "solid green 5px" },
      }}
    >
      {character.classes.map((cls) => {
        return (
          <Stack horizontal horizontalAlign="center" verticalAlign="center">
            <ClassIcon
              className={cls.class}
              styles={{
                root: {
                  borderRadius: "50%",
                  marginRight: DefaultSpacing.s2,
                  maxWidth: "20px",
                },
              }}
            />
            {character.classes.length > 1
              ? `${cls.class} (${cls.level})`
              : cls.class}
          </Stack>
        );
      })}
    </Stack>
  );

  const text = `${character.fullName} (${DataHelper.formatOrdinalNumber(
    character.currentLevel ?? 0
  )} Level)`;

  const tertiaryText = `${character.race.subrace ?? ""} ${
    character.race.race
  }`.trim();

  return (
    <Persona
      text={text}
      onRenderSecondaryText={onRenderClasses}
      tertiaryText={tertiaryText}
      imageUrl={character.avatarUrl}
      size={PersonaSize.size72}
      styles={{ root: { width: 350 } }}
    />
  );
};

export default CharacterCard;
