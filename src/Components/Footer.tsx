import { useSelector } from "react-redux";
import {
  FontSizes,
  MessageBar,
  MessageBarType,
  NeutralColors,
  Stack,
  Text,
} from "@fluentui/react";
import preval from "preval.macro";

const Footer = () => {
  const isDevMode = useSelector((state) => state.isDevMode);

  return (
    <Stack
      styles={{
        root: {
          width: "100%",
          backgroundColor: NeutralColors.gray150,
        },
      }}
      verticalAlign="center"
    >
      {isDevMode ? (
        <Text
          styles={{
            root: {
              margin: "0.5em",
              color: NeutralColors.gray30,
              fontSize: FontSizes.large,
            },
          }}
        >
          Development Mode
        </Text>
      ) : (
        <Stack>
          <MessageBar messageBarType={MessageBarType.warning}>
            This site is a work in progress, and data relies on manual updates.
            Last Release:{" "}
            <b>{`${preval`module.exports = new Date().toDateString();`}. `}</b>
            Note that this is not the same as the last time the data was
            updated.
          </MessageBar>
        </Stack>
      )}
    </Stack>
  );
};

export default Footer;
