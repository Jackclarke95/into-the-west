import { GroupSpacer, Image, Stack, Text } from "@fluentui/react";
import { Monsters } from "../../Data/Monsters";
import {
  mainTitleStyles,
  statBlockBlackStyles,
  statBlockMetaStyles,
  statBlockTitleStyles,
} from "../../Style/Fonts/FontStyles";
import { AdvanceddCharacteristics } from "./AdvancedCharacteristics";
import { BasicCharacteristics } from "./BasicCharacteristics";
import { Divider } from "./Divider";
import { Stats } from "./Stats";
import { Traits } from "./Traits";

export const StatBlock = () => {
  const monsters = Monsters;
  const monsterCount = monsters.length;
  const rand = Math.floor(Math.random() * monsterCount);

  const randomMonster = monsters[0];

  console.log(randomMonster);

  return (
    <Stack horizontal>
      <Stack
        styles={{
          root: {
            textAlign: "left",
            position: "relative",
            padding: "0.5em 1em",
            height: "500px",
          },
        }}
      >
        <Text styles={mainTitleStyles}>{randomMonster.name}</Text>
        <Text styles={statBlockMetaStyles}>{`${randomMonster.size} ${
          randomMonster.type
        }, ${randomMonster.subtype && `(${randomMonster.subtype}) `}typically ${
          randomMonster.alignment
        }`}</Text>
        <Divider />
        <BasicCharacteristics monster={randomMonster} />
        <Divider />
        <Stats monster={randomMonster} />
        <Divider />
        <AdvanceddCharacteristics monster={randomMonster} />
        <Divider />
        {randomMonster.special_abilities && (
          <Traits
            data={randomMonster.special_abilities}
            header={undefined}
            className="traits"
          />
        )}
        {randomMonster.actions && (
          <Traits
            data={randomMonster.actions}
            header="Actions"
            className="actions"
          />
        )}
        {randomMonster.legendary_actions && (
          <Traits
            data={randomMonster.legendary_actions}
            header="Legendary Actions"
            className="legendary-actions"
          />
        )}
        {randomMonster.reactions && (
          <Traits
            data={randomMonster.reactions}
            header="Reactions"
            className="reactions"
          />
        )}
      </Stack>
    </Stack>
  );
};
