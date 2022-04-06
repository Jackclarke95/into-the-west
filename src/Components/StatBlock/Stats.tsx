import { Stack, Text } from "@fluentui/react";
import {
  blackBoldStyles,
  blackStyles,
  mainTitleStyles,
  metaStyles,
  redBoldStyles,
  redStyles,
} from "./StatBlock";

export const Stats = (monster) => {
  monster = monster.monster;

  return (
    <Stack
      horizontal
      styles={{
        root: {
          width: "100%",
          justifyContent: "space-around",
          textAlign: "center",
          color: "#8a1c0a",
        },
      }}
    >
      <Stack>
        <Text styles={redBoldStyles}>STR</Text>
        <Text styles={redStyles}>{`${monster.STR} ${monster.STR_mod}`}</Text>
      </Stack>
      <Stack>
        <Text styles={redBoldStyles}>DEX</Text>
        <Text styles={redStyles}>{`${monster.DEX} ${monster.DEX_mod}`}</Text>
      </Stack>
      <Stack>
        <Text styles={redBoldStyles}>CON</Text>
        <Text styles={redStyles}>{`${monster.CON} ${monster.CON_mod}`}</Text>
      </Stack>
      <Stack>
        <Text styles={redBoldStyles}>INT</Text>
        <Text styles={redStyles}>{`${monster.INT} ${monster.INT_mod}`}</Text>
      </Stack>
      <Stack>
        <Text styles={redBoldStyles}>WIS</Text>
        <Text styles={redStyles}>{`${monster.WIS} ${monster.WIS_mod}`}</Text>
      </Stack>
      <Stack>
        <Text styles={redBoldStyles}>CHA</Text>
        <Text styles={redStyles}>{`${monster.CHA} ${monster.CHA_mod}`}</Text>
      </Stack>
    </Stack>
  );
};
