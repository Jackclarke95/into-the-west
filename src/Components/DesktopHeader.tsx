import { FontSizes, Image, NeutralColors, Stack, Text } from "@fluentui/react";

const DesktopHeader = () => {
  return (
    <Stack
      className="header"
      horizontalAlign="center"
      horizontal
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          backgroundColor: NeutralColors.gray150,
          width: "100%",
          padding: 10,
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
