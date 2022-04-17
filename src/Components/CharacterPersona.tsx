import { DefaultSpacing, Persona, PersonaSize, Stack } from "@fluentui/react";
import DataHelper from "../Helpers/DataHelper";
import { ClassIcon } from "./ClassIcon";

const CharacterPersona = (props) => {
  const character = props.character;

  const onRenderClasses = () => (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{
        root: { padding: 0, maxHeight: "23px" },
      }}
    >
      {character.classes.map((cls) => {
        return (
          <Stack horizontal horizontalAlign="center" verticalAlign="center">
            <ClassIcon
              className={cls.class.name}
              styles={{
                root: {
                  borderRadius: "50%",
                  marginRight: DefaultSpacing.s2,
                  maxWidth: "20px",
                },
              }}
            />
            {character.classes.length > 1
              ? `${cls.class.name} (${cls.level})`
              : cls.class.name}
          </Stack>
        );
      })}
    </Stack>
  );

  return (
    <Persona
      text={`${character.name} (${DataHelper.formatOrdinalNumber(
        character.currentLevel
      )} Level)`}
      onRenderSecondaryText={onRenderClasses}
      tertiaryText={
        character.subrace
          ? `${character.subrace} ${character.race}`
          : character.race
      }
      imageUrl={props.character.avatarUrl}
      size={PersonaSize.size72}
      styles={{ root: { width: 350 } }}
    />
  );
};

export default CharacterPersona;
