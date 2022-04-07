import { Stack, Text } from "@fluentui/react";
import { MonsterXpTable } from "../../Data/XpTable";
import {
  statBlockRedBoldStyles,
  statBlockRedStyles,
} from "../../Style/Fonts/FontStyles";

export const AdvanceddCharacteristics = ({ monster }) => {
  monster = monster;

  const statLine = (title: string, data: string) => {
    return (
      <Stack
        horizontal
        tokens={{ childrenGap: 4 }}
        styles={{
          root: {
            display: "flow-root",
            textIndent: "-10px",
            paddingLeft: "10px",
          },
        }}
      >
        <Text styles={statBlockRedBoldStyles}>{title}</Text>
        <Text styles={statBlockRedStyles}>{data}</Text>
      </Stack>
    );
  };

  const saves = [] as string[];
  const skills = [] as string[];

  if (monster.strength_save) saves.push(`STR ${monster.strength_save}`);
  if (monster.dexterity_save) saves.push(`DEX ${monster.dexterity_save}`);
  if (monster.constitution_save) saves.push(`CON ${monster.constitution_save}`);
  if (monster.intelligence_save) saves.push(`INT ${monster.intelligence_save}`);
  if (monster.wisdom_save) saves.push(`WIS ${monster.wisdom_save}`);
  if (monster.charisma_save) saves.push(`CHA ${monster.charisma_save}`);

  if (monster.acrobatics) skills.push(`Acrobatics +${monster.acrobatics}`);
  if (monster.animal_handling)
    skills.push(`Animal Handling +${monster.animal_handling}`);
  if (monster.arcana) skills.push(`Arcana +${monster.arcana}`);
  if (monster.athletics) skills.push(`Athletics +${monster.athletics}`);
  if (monster.deception) skills.push(`Deception +${monster.deception}`);
  if (monster.history) skills.push(`History +${monster.history}`);
  if (monster.insight) skills.push(`Insight +${monster.insight}`);
  if (monster.intimidation)
    skills.push(`Intimidation +${monster.intimidation}`);
  if (monster.investigation)
    skills.push(`Investigation +${monster.investigation}`);
  if (monster.medicine) skills.push(`Medicine +${monster.medicine}`);
  if (monster.nature) skills.push(`Nature +${monster.nature}`);
  if (monster.perception) skills.push(`Perception +${monster.perception}`);
  if (monster.performance) skills.push(`Performance +${monster.performance}`);
  if (monster.persuasion) skills.push(`Persuasion +${monster.persuasion}`);
  if (monster.religion) skills.push(`Religion +${monster.religion}`);
  if (monster.sleight_of_hand)
    skills.push(`Sleight of Hand +${monster.sleight_of_hand}`);
  if (monster.stealth) skills.push(`Stealth +${monster.stealth}`);
  if (monster.survival) skills.push(`Survival +${monster.survival}`);

  return (
    <Stack
      styles={{
        root: { width: "350px", paddingTop: "0.5em" },
      }}
    >
      {saves && statLine("Saving Throws", saves.join(", "))}
      {skills.length > 0 && statLine("Skills", skills.join(", "))}
      {monster.damage_vulnerabilities &&
        statLine("Damage Vulnerabilities", monster.damage_vulnerabilities)}
      {monster.damage_resistances &&
        statLine("Damage Resistances", monster.damage_resistances)}
      {monster.damage_immunities &&
        statLine("Damage Immunities", monster.damage_immunities)}
      {monster.condition_immunities &&
        statLine("Condition Immunities", monster.condition_immunities)}
      {monster.senses && statLine("Senses", monster.senses)}
      {monster.languages && statLine("Languages", monster.languages)}
      {monster.challenge_rating &&
        statLine(
          "Challenge",
          `${monster.challenge_rating} (${parseInt(
            MonsterXpTable[monster.challenge_rating]
          ).toLocaleString("en-GB")} XP)`
        )}
    </Stack>
  );
};
