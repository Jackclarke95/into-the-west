import { Stack, Text } from "@fluentui/react";
import {
  statBlockBlackBoldStyles,
  statBlockBlackStyles,
  statBlockTitleStyles,
} from "../../Style/Fonts/FontStyles";

export const Traits: React.FC<{
  data: any;
  header: string | undefined;
  className: string;
}> = ({ data, header, className }) => {
  const traitLine = (title: string, data: string) => {
    return (
      <Stack
        horizontal
        tokens={{ childrenGap: 4 }}
        styles={{ root: { display: "block" } }}
      >
        <Text styles={statBlockBlackBoldStyles}>{title}.</Text>
        <Text styles={statBlockBlackStyles}>{data}</Text>
      </Stack>
    );
  };

  return (
    <Stack
      className={className}
      styles={{
        root: { width: "350px", paddingTop: "0.5em" },
      }}
      tokens={{ childrenGap: 5 }}
    >
      {header && <Text styles={statBlockTitleStyles}>{header}</Text>}
      <Text styles={statBlockBlackStyles}>
        {data.map((datum) => {
          return traitLine(datum.name, datum.desc);
        })}
      </Text>
    </Stack>
  );
};
