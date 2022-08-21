import { FontSizes, Image, NeutralColors, Stack, Text } from "@fluentui/react";
import { NavLink } from "react-router-dom";

const DesktopHeader = () => {
  return (
    <Stack
      className="header"
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          backgroundColor: NeutralColors.gray150,
        },
      }}
    >
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            padding: "0.2em",
            fontSize: FontSizes.superLarge,
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
      <Stack
        horizontal
        horizontalAlign="center"
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            color: NeutralColors.gray30,
          },
        }}
      >
        <NavLink to="/" replace>
          Home
        </NavLink>
        <NavLink to="characters" replace>
          Characters
        </NavLink>
        <NavLink to="sessions" replace>
          Sessions
        </NavLink>
        <NavLink to="profile" replace>
          Profile
        </NavLink>
      </Stack>
    </Stack>
  );
};

export default DesktopHeader;
