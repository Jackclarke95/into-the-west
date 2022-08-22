import { Stack } from "@fluentui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SessionRole from "../Enums/SessionRole";
import DataHelper from "../Helpers/DataHelper";
import { Player, Character, Map, Session } from "../Types/LocalStructures";
import LevelUp from "../Data/LevelUp";
import { GlobalVariables } from "../Data/GlobalVariables";

import Everwilds from "../Images/Maps/The Everwilds - Preview.jpg";
import ForgottenLands from "../Images/Maps/The Forgotten Lands - Preview.jpg";
import LunarIsles from "../Images/Maps/The Lunar Isles - Preview.jpg";
import ShatteredRealms from "../Images/Maps/The Shattered Realms - Preview.jpg";

const DataParse: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  const databaseMaps = useSelector((state) => state.databaseMaps);
  const databasePlayers = useSelector((state) => state.databasePlayers);

  const databaseCharacters = useSelector((state) => state.databaseCharacters);
  const characterClasses = useSelector((state) => state.characterClasses);
  const characterRaces = useSelector((state) => state.characterRaces);
  const raceConfigs = useSelector((state) => state.raceConfigs);
  const classConfigs = useSelector((state) => state.classConfigs);
  const races = useSelector((state) => state.races);
  const subraces = useSelector((state) => state.subraces);
  const classes = useSelector((state) => state.classes);
  const subclasses = useSelector((state) => state.subclasses);

  const databaseSessions = useSelector((state) => state.databaseSessions);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  const maps = useSelector((state) => state.maps);
  const players = useSelector((state) => state.players);
  const characters = useSelector((state) => state.characters);
  const authUser = useSelector((state) => state.authUser);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  // Set current player
  useEffect(() => {
    if (players.isLoading || !authUser) {
      return;
    }

    const currentPlayer = players.data.find(
      (player) => player.id === authUser.uid
    );

    dispatch({
      type: "SetCurrentPlayer",
      currentPlayer: { isLoading: false, data: currentPlayer },
    });
  }, [players, authUser, dispatch]);

  // Set current character
  useEffect(() => {
    if (characters.isLoading || currentPlayer.isLoading) {
      return;
    }

    const currentPlayerCharacter = characters.data.find(
      (character) =>
        character.player?.id === currentPlayer.data?.id &&
        !character.retirement.isRetired
    );

    dispatch({
      type: "SetActiveCharacter",
      activeCharacter: { isLoading: false, data: currentPlayerCharacter },
    });
  }, [characters, currentPlayer, dispatch]);

  // Parse Maps
  useEffect(() => {
    if (
      databaseMaps.isLoading ||
      databaseCharacters.isLoading ||
      databaseSessions.isLoading ||
      sessionInterests.isLoading ||
      databasePlayers.isLoading
    ) {
      return;
    }

    const parsedMaps: Map[] = databaseMaps.data.map((map) => ({
      id: map.key,
      name: map.name,
    }));

    dispatch({
      type: "SetMaps",
      maps: { isLoading: false, data: parsedMaps },
    });
  }, [
    databaseCharacters,
    databaseMaps,
    databasePlayers,
    databaseSessions,
    dispatch,
    sessionInterests,
  ]);

  // Parse Players
  useEffect(() => {
    if (
      databaseCharacters.isLoading ||
      databaseSessions.isLoading ||
      sessionInterests.isLoading ||
      databasePlayers.isLoading
    ) {
      return;
    }

    const parsedPlayers: Player[] = databasePlayers.data.map((player) => {
      const pastSessions = databaseSessions.data.filter(
        (session) =>
          session.selectedDate && DataHelper.isDateInPast(session.selectedDate)
      );

      const pastSessionInterests = sessionInterests.data.filter((interest) =>
        pastSessions.map((session) => session.key).includes(interest.sessionId)
      );

      const attendedPlayerSessions = pastSessionInterests
        .filter((interest) => interest.playerId === player.key)
        .map((interest) => {
          const session = pastSessions.find(
            (session) => session.key === interest.sessionId
          );

          if (!session) {
            throw new Error(
              `Could not find matching session for session interest ${interest.key}`
            );
          }

          return {
            id: session.key,
            name: session.title,
            date: session.selectedDate,
            role: interest.role,
          };
        });

      const sessionsPlayed = attendedPlayerSessions.filter(
        (session) => session.role === SessionRole.Player
      ).length;

      const sessionsRun = attendedPlayerSessions.filter(
        (session) => session.role === SessionRole["Dungeon Master"]
      ).length;

      const unattendedSessions = pastSessions.filter(
        (session) =>
          !attendedPlayerSessions.some(
            (attendedSession) => attendedSession.id === session.key
          )
      ).length;

      const xp =
        sessionsPlayed * GlobalVariables.XP.XP_PER_SESSION_ATTENDED +
        sessionsRun * GlobalVariables.XP.XP_PER_SESSION_RUN +
        unattendedSessions * GlobalVariables.XP.XP_PER_SESSION_UNATTENDED;

      const attainedLevels = LevelUp.filter(
        (level) => xp >= level.xpRequired
      ).length;

      return {
        availableDates: player.availableDates ?? [],
        id: player.key,
        isGamesMaster: player.isGamesMaster,
        isDungeonMaster: player.isDungeonMaster,
        name: player.name,
        characterLevel: attainedLevels ?? 0,
        xp: xp,
        sessionsPlayed: sessionsPlayed,
        sessionsRun: sessionsRun,
      };
    });

    dispatch({
      type: "SetPlayers",
      players: { isLoading: false, data: parsedPlayers },
    });
  }, [
    dispatch,
    databaseSessions,
    databaseCharacters,
    sessionInterests,
    databasePlayers,
  ]);

  // Parse characters
  useEffect(() => {
    if (
      databaseCharacters.isLoading ||
      characterRaces.isLoading ||
      raceConfigs.isLoading ||
      races.isLoading ||
      subraces.isLoading ||
      characterClasses.isLoading ||
      classConfigs.isLoading ||
      classes.isLoading ||
      subclasses.isLoading ||
      players.isLoading
    ) {
      return;
    }

    const parsedCharacters: Character[] = databaseCharacters.data.map(
      (character) => {
        // Parse character's race
        const matchingCharacterRace = characterRaces.data.find(
          (race) => race.characterId === character.key
        );

        if (!matchingCharacterRace) {
          throw new Error(
            `Could not find matching Character Race Data for character ${character.key}`
          );
        }

        const matchingRaceConfig = raceConfigs.data.find(
          (config) => config.key === matchingCharacterRace.raceConfigId
        );

        if (!matchingRaceConfig) {
          throw new Error(
            `Could not find matching Race Config Data for character ${character.key}`
          );
        }

        const matchingRace = races.data.find(
          (race) => race.key === matchingRaceConfig.raceId
        );

        if (!matchingRace) {
          throw new Error(
            `Could not find matching Race Data for character ${character.key}`
          );
        }

        const matchingSubrace = subraces.data.find(
          (subrace) => subrace.key === matchingRaceConfig.subraceId
        );

        const parsedRace = {
          race: matchingRace.name,
          subrace: matchingSubrace?.name,
        };

        // Parse character's class(es)
        const parsedClasses = characterClasses.data
          .filter((cls) => cls.characterId === character.key)
          .map((matchedCharacterClass) => {
            const matchingClassConfig = classConfigs.data.find(
              (config) => config.key === matchedCharacterClass.classConfigId
            );

            if (!matchingClassConfig) {
              throw new Error(
                `Could not find matching Class Config Data for character ${character.key}`
              );
            }

            const matchingClass = classes.data.find(
              (cls) => cls.key === matchingClassConfig.classId
            );

            if (!matchingClass) {
              throw new Error(
                `Could not find matching Class Data for character ${character.key}`
              );
            }

            const matchingSubclass = subclasses.data.find(
              (subClass) => subClass.key === matchingClassConfig.subclassId
            );

            return {
              level: matchedCharacterClass.level,
              class: matchingClass.name,
              subclass: matchingSubclass ? matchingSubclass.name : undefined,
            };
          });

        // Parse character's owner/player
        const matchingPlayer = players.data.find(
          (player) => player.id === character.playerId
        );

        return {
          id: character.key,
          player: matchingPlayer,
          fullName: character.fullName,
          nickname: character.nickname ?? undefined,
          race: parsedRace,
          classes: parsedClasses,
          startingLevel: character.startingLevel,
          currentLevel: matchingPlayer?.characterLevel,
          avatarUrl: character.avatarUrl,
          retirement: character.retirement
            ? {
                isRetired: true,
                level: character.retirement.level,
                date: character.retirement.date,
                reason: character.retirement.reason,
              }
            : { isRetired: false },
          sheetUrl: character.sheetUrl,
        };
      }
    );

    dispatch({
      type: "SetCharacters",
      characters: { isLoading: false, data: parsedCharacters },
    });
  }, [
    characterClasses,
    characterRaces,
    classConfigs,
    classes,
    databaseCharacters,
    dispatch,
    players,
    raceConfigs,
    races,
    subclasses,
    subraces,
  ]);

  // Parse Sessions
  useEffect(() => {
    if (
      databaseSessions.isLoading ||
      sessionInterests.isLoading ||
      characters.isLoading ||
      players.isLoading ||
      maps.isLoading
    ) {
      return;
    }

    const parsedSessions: Session[] = databaseSessions.data.map((session) => {
      const matchingSessionAttendedInterests = sessionInterests.data.filter(
        (interest) => interest.sessionId === session.key
      );

      const attendedCharacters = characters.data.filter(
        (character) =>
          (!character.retirement?.isRetired ||
            character.retirement.date >
              (session.selectedDate ?? new Date().getTime())) &&
          character.player &&
          sessionInterests.data
            .filter(
              (interest) =>
                interest.sessionId === session.key &&
                interest.role === SessionRole.Player &&
                interest.didAttend === true
            )
            .map((interest) => interest.playerId)
            .includes(character.player?.id)
      );

      const deduplicatedAttendedCharacters: Character[] = [];

      // For each player, only include the character who actually attended
      attendedCharacters.forEach((attendee) => {
        if (
          !deduplicatedAttendedCharacters.some(
            (character) => character.player?.id === attendee.player?.id
          )
        ) {
          deduplicatedAttendedCharacters.push(attendee);
        }
      });

      const interestedCharacters = characters.data.filter(
        (character) =>
          (!character.retirement?.isRetired ||
            character.retirement.date >
              (session.selectedDate ?? new Date().getTime())) &&
          character.player &&
          sessionInterests.data
            .filter(
              (interest) =>
                interest.sessionId === session.key &&
                interest.role === SessionRole.Player &&
                !interest.didAttend
            )
            .map((interest) => interest.playerId)
            .includes(character.player?.id)
      );

      const deduplicatedInterestedCharacters: Character[] = [];

      // For each player, only include the character who actually attended
      interestedCharacters.forEach((attendee) => {
        if (
          !deduplicatedInterestedCharacters.some(
            (character) => character.player?.id === attendee.player?.id
          )
        ) {
          deduplicatedInterestedCharacters.push(attendee);
        }
      });

      const dungeonMaster = players.data.find(
        (player) =>
          player.id ===
          matchingSessionAttendedInterests.find(
            (interest) =>
              interest.sessionId === session.key &&
              interest.role === SessionRole["Dungeon Master"]
          )?.playerId
      );

      const matchingMap = maps.data.find((map) => map.id === session.mapId);

      if (!matchingMap) {
        throw new Error(
          `Could not find matching Map Data for session ${session.key}`
        );
      }

      return {
        id: session.key,
        name: session.title,
        dungeonMaster: dungeonMaster,
        date: session.selectedDate,
        attendees: {
          attending: deduplicatedAttendedCharacters,
          interested: deduplicatedInterestedCharacters,
        },
        map: matchingMap,
        suggestedByPlayerId: session.suggestedByPlayerId,
        isCompleted: session.isCompleted ?? false,
      };
    });

    dispatch({
      type: "SetSessions",
      sessions: { isLoading: false, data: parsedSessions },
    });
  }, [characters, databaseSessions, dispatch, maps, players, sessionInterests]);

  return (
    <Stack
      className="data-parse"
      horizontalAlign="center"
      styles={{
        root: {
          height: "100vh",
          overflow: "auto",
          width: "100%",
          backgroundImage: authUser
            ? `url("${DataHelper.getRandomFromArray([
                Everwilds,
                ForgottenLands,
                LunarIsles,
                ShatteredRealms,
              ])}")`
            : "",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundComposite: "saturation",
        },
      }}
    >
      {children}
    </Stack>
  );
};

export default DataParse;
