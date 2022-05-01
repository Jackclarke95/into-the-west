import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";

const Tools = () => {
  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Separator
        styles={{
          root: {
            fontSize: FontSizes.xLargePlus,
          },
        }}
      >
        Tools
      </Separator>
      <DefaultButton text="Token creator" />
    </Stack>
  );
};

export default Tools;
