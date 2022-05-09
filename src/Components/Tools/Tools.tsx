import { DefaultButton, FontSizes, Separator, Stack } from "@fluentui/react";
import { useDispatch } from "react-redux";

const Tools = () => {
  const dispatch = useDispatch();

  const onClickShowTokenCreator = () => {
    console.log("Displaying token creator");
    dispatch({
      type: "SetShowTokenCreatorDialog",
      showTokenCreatorDialog: true,
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
    </Stack>
  );
};

export default Tools;
