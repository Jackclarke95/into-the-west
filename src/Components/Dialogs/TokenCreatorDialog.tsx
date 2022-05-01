import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../../Data/Classes";

const TokenCreatorDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showTokenCreatorDialog);

  const [characterClass, setCharacterClass] = useState<string | undefined>(
    undefined
  );

  const onDismiss = () => {
    dispatch({
      type: "SetShowTokenCreatorDialog",
      showTokenCreatorDialog: false,
    });
  };

  const onClickDownloadToken = () => {
    console.log("clicked download token");
  };

  const contentProps = {
    type: DialogType.close,
    title: "New session",
    closeButtonAriaLabel: "Close",
  };

  const classOptions = Classes.map((cls) => ({
    key: cls.name,
    text: cls.name,
  }));

  const onChangeClass = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterClass(undefined);
    } else {
      setCharacterClass(option.text);
    }
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <Dropdown label="Class" options={classOptions} onChange={onChangeClass} />
      <canvas id="token-canvas" width="250" height="400"></canvas>
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Download" onClick={onClickDownloadToken} />
      </DialogFooter>
    </Dialog>
  );
};

export default TokenCreatorDialog;
