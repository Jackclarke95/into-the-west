import { MessageBar, MessageBarType } from "@fluentui/react";

const MobileFooter = () => {
  return (
    <MessageBar messageBarType={MessageBarType.warning}>
      Mobile website is not fully functional
    </MessageBar>
  );
};

export default MobileFooter;
