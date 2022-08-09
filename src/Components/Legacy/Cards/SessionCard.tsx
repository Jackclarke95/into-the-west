import {
  IFacepilePersona,
  Facepile,
  PersonaSize,
  Stack,
  Text,
  FontSizes,
  IconButton,
  IIconProps,
  TooltipHost,
} from "@fluentui/react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../../Helpers/DataHelper";
import DataService from "../../../Helpers/DataService";
import { Session, Character } from "../../../Types/LocalStructures";

const SessionCard: React.FC<{
  session: Session;
  characters: Character[];
}> = ({ session, characters }) => {
  const dispatch = useDispatch();

  const sessionInterests = useSelector((state) => state.sessionInterests);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  const onRenderAttendees = () => {
    const personas = [
      ...session.attendees.interested,
      ...session.attendees.attending,
    ]
      .map((attendee) => {
        const matchedCharacter = characters.find(
          (character) => character.id === attendee.id
        );

        return {
          imageUrl: matchedCharacter?.avatarUrl,
          personaName: matchedCharacter?.fullName,
        } as IFacepilePersona;
      })
      .sort((a, b) => a.personaName!.localeCompare(b.personaName!));

    return (
      <Facepile
        personas={personas}
        personaSize={PersonaSize.size16}
        maxDisplayablePersonas={personas.length}
      />
    );
  };

  const playerInterestInSession =
    !currentPlayer.isLoading &&
    !sessionInterests.isLoading &&
    sessionInterests.data.find(
      (interest) =>
        interest.playerId === currentPlayer.data?.id &&
        interest.sessionId === session.id
    );

  const playerIsInterested = !!playerInterestInSession;

  const onClickRemoveFromSession = async (session: Session) => {
    if (!playerInterestInSession) {
      return;
    }

    dispatch({
      type: "SetConfirmation",
      confirmation: {
        isShown: true,
        message: "Are you sure you wish to unregister from this session?",
        onConfirm: async () =>
          await DataService.unregisterFromSession(playerInterestInSession),
      },
    });
  };

  const onClickAddToSession = (session: Session) => {
    dispatch({
      type: "SetSessionRegistration",
      sessionRegistration: { isShown: true, session: session },
    });
  };

  const onClickManageSession = (session: Session) => {
    dispatch({
      type: "SetSessionManagement",
      sessionManagement: { isShown: true, session: session },
    });
  };

  const registerIcon: IIconProps = {
    iconName: "AddFriend",
  };

  const unregisterIcon: IIconProps = {
    iconName: "UserRemove",
  };

  const manageIcon: IIconProps = {
    iconName: "Settings",
  };

  return (
    <Stack tokens={{ childrenGap: 5 }} horizontal>
      <Stack styles={{ root: { width: "100%" } }}>
        <Stack
          horizontal
          tokens={{ childrenGap: 5 }}
          styles={{ root: { display: "flex", flexGrow: 1 } }}
        >
          <Text
            styles={{
              root: {
                fontSize: FontSizes.size16,
              },
            }}
          >
            {session.name}
          </Text>
        </Stack>
        <Stack
          horizontal
          styles={{
            root: { width: "100%", justifyContent: "space-between" },
          }}
        >
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Text styles={{ root: { fontWeight: "bold" } }}>Players:</Text>
            {onRenderAttendees()}
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Text styles={{ root: { fontWeight: "bold" } }}>DM:</Text>
            <Text>
              {session.dungeonMaster
                ? session.dungeonMaster?.name
                : "Unassigned"}
            </Text>
          </Stack>
        </Stack>
        <Stack
          horizontal
          styles={{
            root: { width: "100%", justifyContent: "space-between" },
          }}
        >
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Text styles={{ root: { fontWeight: "bold" } }}>Map:</Text>
            <Text>{session.map.name}</Text>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 5 }}>
            <Text styles={{ root: { fontWeight: "bold" } }}>Date:</Text>
            <Text>
              {session.date
                ? new Date(session.date).toLocaleDateString()
                : "Unscheduled"}
            </Text>
          </Stack>
        </Stack>
      </Stack>
      {isMobile && (
        <Stack>
          {DataHelper.isDateInPast(session.date!) ? (
            <Stack styles={{ root: { width: 52 } }}></Stack>
          ) : playerIsInterested ? (
            <TooltipHost content="Unregister from session">
              <IconButton
                iconProps={unregisterIcon}
                disabled={false}
                onClick={() => onClickRemoveFromSession(session)}
              />
            </TooltipHost>
          ) : (
            <TooltipHost content="Register for session">
              <IconButton
                iconProps={registerIcon}
                disabled={false}
                onClick={() => onClickAddToSession(session)}
              />
            </TooltipHost>
          )}
          {!DataHelper.isDateInPast(session.date!) &&
            !currentPlayer.isLoading &&
            (currentPlayer.data?.isDungeonMaster ||
              session.suggestedByPlayerId === currentPlayer.data?.id) && (
              <TooltipHost content="Manage session">
                <IconButton
                  iconProps={manageIcon}
                  disabled={false}
                  onClick={() => onClickManageSession(session)}
                />
              </TooltipHost>
            )}
        </Stack>
      )}
    </Stack>
  );
};

export default SessionCard;
