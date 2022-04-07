import { Stack, Text } from "@fluentui/react";
import {
  statBlockRedBoldStyles,
  statBlockRedStyles,
} from "../../Style/Fonts/FontStyles";

export const BasicCharacteristics = ({ monster }) => {
  const conMod = Math.floor((monster.constitution - 10) / 2);
  const hitDicecount = monster.hit_dice.split("d")[0];

  return (
    <Stack
      styles={{
        root: { width: "350px", paddingTop: "0.5em" },
      }}
      tokens={{ childrenGap: 5 }}
    >
      <Stack horizontal tokens={{ childrenGap: 4 }}>
        <Text styles={statBlockRedBoldStyles}>Armor Class</Text>
        <Text styles={statBlockRedStyles}>{monster.armor_class}</Text>
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 4 }}>
        <Text styles={statBlockRedBoldStyles}>Hit Points</Text>
        <Text styles={statBlockRedStyles}>{`${monster.hit_points} (${
          monster.hit_dice
        } + ${conMod * hitDicecount})`}</Text>
      </Stack>
      <Stack horizontal tokens={{ childrenGap: 4 }}>
        <Text styles={statBlockRedBoldStyles}>Speed</Text>
        <Text styles={statBlockRedStyles}>{monster.speed}</Text>
      </Stack>
    </Stack>
  );
};
