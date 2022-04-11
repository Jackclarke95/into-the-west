import { useSelector } from "react-redux";
import {
  FontSizes,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
} from "@fluentui/react";
import preval from "preval.macro";

export default () => {
  const isDevMode = useSelector((state) => state.isDevMode);

  return (
    <Stack
      className="footer-container"
      styles={{ root: { width: "100%", display: "flex" } }}
      verticalAlign="center"
    >
      {isDevMode ? (
        <Text
          className="footer"
          styles={{ root: { fontSize: FontSizes.large } }}
        >
          Development Mode
        </Text>
      ) : (
        <Stack>
          <MessageBar messageBarType={MessageBarType.warning}>
            This site is a work in progress, and data relies on manual updates.
            Last Release:{" "}
            {`${preval`module.exports = new Date().toDateString();`}. `}
            Note that this is not the same as the last time the data was
            updated.
          </MessageBar>
        </Stack>
      )}
    </Stack>
  );
};
