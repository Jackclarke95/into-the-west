import { FontSizes, Image, NeutralColors, Stack, Text } from "@fluentui/react";

const MobileHeader = () => {
  return (
    <Stack
      horizontal
      horizontalAlign="center"
      verticalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          width: "100%",
          padding: "1em",
          backgroundColor: NeutralColors.gray150,
          display: "flex",
        },
      }}
    >
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={48} />
      <Text
        styles={{
          root: {
            color: NeutralColors.gray30,
            fontSize: FontSizes.xxLargePlus,
          },
        }}
      >
        Into the West
      </Text>
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={48} />
    </Stack>
  );
};

export default MobileHeader;
