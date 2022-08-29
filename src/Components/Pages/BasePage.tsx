import { Stack, Text } from "@fluentui/react";

const BasePage: React.FC<{ children: React.ReactNode; pageTitle: string }> = ({
  children,
  pageTitle,
}) => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          paddingTop: 10,
          overflowY: "auto",
        },
      }}
    >
      <Text variant="xxLargePlus" styles={{ root: { textAlign: "center" } }}>
        {pageTitle}
      </Text>
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
