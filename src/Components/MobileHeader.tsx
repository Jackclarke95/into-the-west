import {
  CommandBar,
  FontSizes,
  ICommandBarProps,
  Image,
  NeutralColors,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch } from "react-redux";
import DataService from "../Helpers/DataService";

const MobileHeader = () => {
  const dispatch = useDispatch();

  const onClickCreateSession = () => {
    console.log("Clicked create session");

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  const onClickSignOut = async () => {
    await DataService.signOut();
  };

  const CommandBarProps: ICommandBarProps = {
    items: [
      {
        key: "newSession",
        text: "New Session",
        iconProps: { iconName: "Add" },
        onClick: onClickCreateSession,
      },
      {
        key: "sign-out",
        text: "Sign Out",
        iconProps: { iconName: "SignOut" },
        onClick: onClickSignOut,
      },
    ],
  };

  return (
    <Stack>
      <Stack
        horizontal
        horizontalAlign="center"
        verticalAlign="center"
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            width: "100%",
            padding: "1em",
            backgroundColor: NeutralColors.gray150,
            display: "flex",
          },
        }}
      >
        <Image src={process.env.PUBLIC_URL + "logo512.png"} height={48} />
        <Text
          styles={{
            root: {
              color: NeutralColors.gray30,
              fontSize: FontSizes.xxLargePlus,
            },
          }}
        >
          Into the West
        </Text>
        <Image src={process.env.PUBLIC_URL + "logo512.png"} height={48} />
      </Stack>
      <CommandBar items={CommandBarProps.items}></CommandBar>
    </Stack>
  );
};

export default MobileHeader;
