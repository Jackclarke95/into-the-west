import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";
import { useDispatch } from "react-redux";
import DataService from "../../Helpers/DataService";

const Utilities = () => {
  const dispatch = useDispatch();

  const onClickShowTokenCreator = () => {
    console.log("Displaying token creator");

    dispatch({
      type: "SetShowTokenCreatorDialog",
      showTokenCreatorDialog: true,
    });
  };

  const onClickGenerateKey = () => {
    const key = DataService.generateKey();

    if (key) {
      navigator.clipboard.writeText(key);
      console.log(key);
    } else {
      console.log("Failed to generate key");
    }
  };

  const onClickShowNewRaceDialog = () => {
    dispatch({
      type: "SetShowNewRaceDialog",
      showNewRaceDialog: true,
    });
  };

  const onClickShowNewSubraceDialog = () => {
    dispatch({
      type: "SetShowNewSubraceDialog",
      showNewSubraceDialog: true,
    });
  };

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
      <DefaultButton text="Token creator" onClick={onClickShowTokenCreator} />
      <DefaultButton text="Generate key" onClick={onClickGenerateKey} />
      <DefaultButton text="New race" onClick={onClickShowNewRaceDialog} />
      <DefaultButton
        text="New subrace"
        onClick={onClickShowNewSubraceDialog}
        disabled
      />
    </Stack>
  );
};

export default Utilities;
