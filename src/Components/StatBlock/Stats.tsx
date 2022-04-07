import { Stack, Text } from "@fluentui/react";
import {
  statBlockRedBoldStyles,
  statBlockRedStyles,
} from "../../Style/Fonts/FontStyles";

export const Stats = ({ monster }) => {
  const strengthMod = Math.floor((monster.strength - 10) / 2);
  const dexMod = Math.floor((monster.dexterity - 10) / 2);
  const conMod = Math.floor((monster.constitution - 10) / 2);
  const intMod = Math.floor((monster.intelligence - 10) / 2);
  const wisMod = Math.floor((monster.wisdom - 10) / 2);
  const chaMod = Math.floor((monster.charisma - 10) / 2);

  return (
    <Stack
      horizontal
      styles={{
        root: {
          justifyContent: "space-around",
          textAlign: "center",
          color: "#8a1c0a",
          paddingTop: "0.5em",
          paddingBottom: "0.5em",
          width: "360px",
        },
      }}
    >
      <Stack>
        <Text styles={statBlockRedBoldStyles}>STR</Text>
        <Text styles={statBlockRedStyles}>{`${monster.strength} (${
          Math.sign(strengthMod) === 1 ? "+" : "-"
        }${strengthMod})`}</Text>
      </Stack>
      <Stack>
        <Text styles={statBlockRedBoldStyles}>DEX</Text>
        <Text styles={statBlockRedStyles}>{`${monster.dexterity} (${
          Math.sign(dexMod) === 1 ? "+" : "-"
        }${dexMod})`}</Text>
      </Stack>
      <Stack>
        <Text styles={statBlockRedBoldStyles}>CON</Text>
        <Text styles={statBlockRedStyles}>{`${monster.constitution} (${
          Math.sign(conMod) === 1 ? "+" : "-"
        }${conMod})`}</Text>
      </Stack>
      <Stack>
        <Text styles={statBlockRedBoldStyles}>INT</Text>
        <Text styles={statBlockRedStyles}>{`${monster.intelligence} (${
          Math.sign(intMod) === 1 ? "+" : "-"
        }${intMod})`}</Text>
      </Stack>
      <Stack>
        <Text styles={statBlockRedBoldStyles}>WIS</Text>
        <Text styles={statBlockRedStyles}>{`${monster.wisdom} (${
          Math.sign(wisMod) === 1 ? "+" : "-"
        }${wisMod})`}</Text>
      </Stack>
      <Stack>
        <Text styles={statBlockRedBoldStyles}>CHA</Text>
        <Text styles={statBlockRedStyles}>{`${monster.charisma} (${
          Math.sign(chaMod) === 1 ? "+" : "-"
        }${chaMod})`}</Text>
      </Stack>
    </Stack>
  );
};
