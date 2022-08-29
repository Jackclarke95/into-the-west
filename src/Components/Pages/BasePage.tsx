import { Separator, Stack, Text } from "@fluentui/react";

const BasePage: React.FC<{ children: React.ReactNode; pageTitle: string }> = ({
  children,
  pageTitle,
}) => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          overflowY: "auto",
        },
      }}
    >
      <Separator>
        <Text variant="xxLargePlus">{pageTitle}</Text>
      </Separator>
      <Stack
        styles={{
          root: {
            overflowY: "auto",
          },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default BasePage;
