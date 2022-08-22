import {
  ActionButton,
  FontSizes,
  FontWeights,
  Icon,
  Stack,
  Text,
  useTheme,
} from "@fluentui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

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
              ? theme.palette.themeDark
              : theme.palette.neutralPrimary,
          },
          icon: {
            fontSize: FontSizes.xLarge,
            color: onThisPage
              ? theme.palette.themeDark
              : theme.palette.neutralPrimary,
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
        <NavItem displayText="Profile" url="/profile" iconName="ContactInfo" />
      </Stack>
      <NavItem displayText="Sign Out" iconName="SignOut" iconOnRight />
    </Stack>
  );
};

export default NavigationBar;
