import { ActionButton, FontSizes, Stack, useTheme } from "@fluentui/react";
import { useLocation, useNavigate } from "react-router-dom";
import DataService from "../Helpers/DataService";

const NavigationBar = () => {
  const theme = useTheme();

  const NavItem: React.FC<{
    displayText: string;
    iconName: string;
    url?: string;
    onClickAction?: () => void;
    iconOnRight?: boolean;
  }> = ({ displayText, url, iconName, onClickAction, iconOnRight }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const onThisPage = location.pathname === url;

    const onClick = () => {
      if (onClickAction) {
        onClickAction();
      } else if (url) {
        navigate(url, {
          replace: true,
          state: {
            from: window.location.pathname,
          },
        });
      }
    };

    return (
      <ActionButton
        iconProps={{ iconName }}
        onClick={onClick}
        styles={{
          flexContainer: {
            flexDirection: iconOnRight ? "row-reverse" : "row",
          },
          root: {
            fontSize: FontSizes.xLarge,
            color: onThisPage
              ? theme.palette.accent
              : theme.palette.neutralDark,
          },
          icon: {
            fontSize: FontSizes.xLarge,
            color: onThisPage
              ? theme.palette.accent
              : theme.palette.neutralDark,
          },
        }}
      >
        {displayText}
      </ActionButton>
    );
  };

  return (
    <Stack
      className="nav"
      horizontal
      horizontalAlign="space-between"
      styles={{ root: { width: "100%", padding: "5px 10px" } }}
    >
      <Stack className="main=nav" horizontal horizontalAlign="center">
        <NavItem displayText="Home" url="/" iconName="Home" />
        <NavItem displayText="Characters" url="/characters" iconName="Group" />
        <NavItem
          displayText="Sessions"
          url="/sessions"
          iconName="CalendarAgenda"
        />
        <NavItem
          displayText="My Profile"
          url="/profile"
          iconName="ContactInfo"
        />
      </Stack>
      <NavItem
        displayText="Sign Out"
        iconName="SignOut"
        iconOnRight
        onClickAction={DataService.signOut}
      />
    </Stack>
  );
};

export default NavigationBar;
