import { GroupSpacer, Image, Stack, Text } from "@fluentui/react";
import htmlParse from "html-react-parser";
import { Monsters } from "../../Data/Monsters";
import { Divider } from "./Divider";
import { Stats } from "./Stats";

export const StatBlock = () => {
  const dragons = Monsters.filter((monster) =>
    monster.name.toLowerCase().includes("dragon")
  );

  const monster = dragons[0];

  console.log(monster);

  return (
    <Stack horizontal>
      <Stack
        styles={{
          root: {
            textAlign: "left",
            position: "relative",
            width: "350px",
            padding: "0.5em 1em",
          },
        }}
      >
        <Text styles={mainTitleStyles}>{monster.name}</Text>
        <Text styles={metaStyles}>{monster.meta}</Text>
        <Divider />
        <Stack tokens={{ childrenGap: 5 }}>
          <Stack horizontal tokens={{ childrenGap: 4 }}>
            <Text styles={redBoldStyles}>Armor Class</Text>
            <Text styles={redStyles}>{monster["Armor Class"]}</Text>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }}>
            <Text styles={redBoldStyles}>Hit Points</Text>
            <Text styles={redStyles}>{monster["Hit Points"]}</Text>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }}>
            <Text styles={redBoldStyles}>Speed</Text>
            <Text styles={redStyles}>{monster.Speed}</Text>
          </Stack>
        </Stack>
        <Divider />
        <Stats monster={monster} />
        <Divider />
        <Divider />
        <Text styles={blackStyles}>{htmlParse(monster.Traits!)}</Text>
        <Text styles={titleStyles}>Actions</Text>
        <Text styles={blackStyles}>{htmlParse(monster.Actions!)}</Text>
        <Text styles={titleStyles}>Legendary Actions</Text>
        <Text styles={blackStyles}>
          {htmlParse(monster["Legendary Actions"]!)}
        </Text>
      </Stack>
      <Image src={monster.img_url} width={1000} />
    </Stack>
  );
};

export const mainTitleStyles = {
  root: {
    fontFamily: "Mr Eaves Small Caps",
    fontWeight: "bold",
    fontSize: "2em",
    color: "#8a1c0a",
  },
};

export const metaStyles = {
  root: {
    fontFamily: "Scaly Sans Italic",
  },
};

export const redBoldStyles = {
  root: { color: "#8a1c0a", fontWeight: "bold", fontFamily: "Scala Sans" },
};

export const redStyles = {
  root: { color: "#8a1c0a", fontFamily: "Scala Sans" },
};

export const blackStyles = { root: { fontFamily: "Scala Sans" } };
export const blackBoldStyles = {
  root: { fontWeight: "bold", fontFamily: "Scala Sans" },
};

export const titleStyles = {
  root: {
    fontFamily: "Scaly Sans Caps",
    fontSize: "1.5em",
    color: "#8a1c0a",
    borderBottom: "1px solid #8a1c0a",
  },
};
