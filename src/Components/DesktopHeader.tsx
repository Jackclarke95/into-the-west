import { FontSizes, Image, NeutralColors, Stack, Text } from "@fluentui/react";

const DesktopHeader = () => {
  return (
    <Stack
      horizontal
      horizontalAlign="center"
      verticalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          width: "100%",
          padding: "0.2em",
          fontSize: FontSizes.superLarge,
          backgroundColor: NeutralColors.gray150,
          display: "flex",
        },
      }}
    >
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={64} />
      <Text
        styles={{
          root: {
            color: NeutralColors.gray30,
            fontSize: FontSizes.superLarge,
          },
        }}
      >
        Into the West
      </Text>
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={64} />
    </Stack>
  );
};

export default DesktopHeader;
