import {
  DefaultSpacing,
  FontWeights,
  IPersonaSharedProps,
  NeutralColors,
  Persona,
  PersonaCoin,
  PersonaSize,
  Stack,
  Text,
} from "@fluentui/react";
import { Character } from "../../../Types/LocalStructures";
import { ClassIcon } from "../ClassIcon";
import XpBar from "../XpBar";

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

  const text = character.fullName;

  const tertiaryText = `${character.race.subrace ?? ""} ${
    character.race.race
  }`.trim();

  const onRenderPersonaCoin = (a: IPersonaSharedProps | undefined) => {
    return (
      <Stack styles={{ root: { position: "relative" } }}>
        <PersonaCoin imageUrl={a?.imageUrl} coinSize={72} />
        <Stack
          verticalAlign="center"
          horizontalAlign="center"
          styles={{
            root: {
              position: "absolute",
              bottom: 0,
              right: 0,
              paddingBottom: "0.1em",
              width: 24,
              height: 24,
              backgroundColor: "white",
              borderRadius: "50%",
              borderStyle: "solid",
              borderColor: NeutralColors.gray140,
              borderWidth: 2,
            },
          }}
        >
          <Text
            styles={{
              root: {
                fontWeight: FontWeights.semibold,
              },
            }}
          >
            {character.currentLevel}
          </Text>
        </Stack>
      </Stack>
    );
  };

  const onRenderXpBar = () => <XpBar character={character} />;

  return (
    <Persona
      text={text}
      onRenderSecondaryText={onRenderClasses}
      tertiaryText={tertiaryText}
      imageUrl={character.avatarUrl}
      size={PersonaSize.size100}
      styles={{ root: { width: 350 } }}
      onRenderPersonaCoin={onRenderPersonaCoin}
      onRenderOptionalText={onRenderXpBar}
    />
  );
};

export default CharacterCard;
