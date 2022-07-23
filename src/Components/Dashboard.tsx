import { Pivot, PivotItem, Stack } from "@fluentui/react";
import Profile from "./Profile/Profile";
import Utilities from "./Utilities/Utilities";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SessionRole from "../Enums/SessionRole";
import { Character, Map, Player, Session } from "../Types/LocalStructures";

const Dashboard = () => {
  const dispatch = useDispatch();

  const maps = useSelector((state) => state.databaseMaps);
  const players = useSelector((state) => state.databasePlayers);

  const characters = useSelector((state) => state.databaseCharacters);
  const characterClasses = useSelector((state) => state.characterClasses);
  const characterRaces = useSelector((state) => state.characterRaces);
  const raceConfigs = useSelector((state) => state.raceConfigs);
  const classConfigs = useSelector((state) => state.classConfigs);
  const races = useSelector((state) => state.races);
  const subraces = useSelector((state) => state.subraces);
  const classes = useSelector((state) => state.classes);
  const subclasses = useSelector((state) => state.subclasses);

  const sessions = useSelector((state) => state.databaseSessions);
  const sessionInterests = useSelector((state) => state.sessionInterests);

  useEffect(() => {
    if (
      maps.isLoading ||
      characters.isLoading ||
      characterClasses.isLoading ||
      characterRaces.isLoading ||
      raceConfigs.isLoading ||
      classConfigs.isLoading ||
      races.isLoading ||
      subraces.isLoading ||
      classes.isLoading ||
      subclasses.isLoading ||
      sessions.isLoading ||
      sessionInterests.isLoading ||
      players.isLoading
    ) {
      return;
    }

    const parsedMaps: Map[] = maps.data.map((map) => ({
      id: map.key,
      name: map.name,
    }));

    dispatch({
      type: "SetMaps",
      maps: { isLoading: false, data: parsedMaps },
    });

    console.log(players.data);

    const parsedPlayers: Player[] = players.data.map((player) => {
      const attendedPlayerSessions = sessionInterests.data
        .filter((sessionInterest) => sessionInterest.playerId === player.key)
        .map((interest) => {
          const session = sessions.data.find(
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
        })
        .filter((session) => session !== null);

      const sessionsPlayed = attendedPlayerSessions.filter(
        (session) => session.role === SessionRole.Player
      ).length;

      const sessionsRun = attendedPlayerSessions.filter(
        (session) => session.role === SessionRole["Dungeon Master"]
      ).length;

      const unattendedSessions = sessions.data.filter(
        (session) =>
          !attendedPlayerSessions.some(
            (attendedSession) => attendedSession.id === session.key
          )
      ).length;

      const xp =
        sessionsPlayed * 60 + sessionsRun * 30 + unattendedSessions * 12;

      return {
        availableDates: player.availableDates,
        discordTag: player.discordTag,
        id: player.key,
        isGamesMaster: player.isGamesMaster,
        isDungeonMaster: player.isDungeonMaster,
        name: player.name,
        characterLevel: Math.floor(xp / 120),
        xp: xp,
        sessionsPlayed: sessionsPlayed,
        sessionsRun: sessionsRun,
      };
    });

    dispatch({
      type: "SetPlayers",
      players: { isLoading: false, data: parsedPlayers },
    });

    const parsedCharacters: Character[] = characters.data.map((character) => {
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
            subclass: matchingSubclass
              ? matchingSubclass.subclassName
              : undefined,
          };
        });

      // Parse character's owner/player
      const matchingPlayer = parsedPlayers.find(
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
    });

    dispatch({
      type: "SetCharacters",
      characters: { isLoading: false, data: parsedCharacters },
    });

    const parsedSessions: Session[] = sessions.data
      .map((session) => {
        const matchingsessionInterests = sessionInterests.data.filter(
          (interest) =>
            interest.sessionId === session.key && interest.didAttend === true
        );

        const attendees = parsedCharacters
          .filter(
            (character) =>
              (!character.retirement?.isRetired ||
                character.retirement.date >
                  (session.selectedDate ?? new Date().getTime())) &&
              character.player &&
              sessionInterests.data
                .filter(
                  (interest) =>
                    interest.sessionId === session.key &&
                    interest.role === SessionRole.Player
                )
                .map((interest) => interest.playerId)
                .includes(character.player?.id)
          )
          .sort((a, b) =>
            a.player && b.player ? a.player?.id.localeCompare(b.player?.id) : 0
          )
          .sort((a, b) => {
            if (a.retirement.isRetired && b.retirement.isRetired) {
              return a.retirement.date - b.retirement.date;
            } else {
              if (a.retirement.isRetired) {
                return -1;
              } else {
                return 1;
              }
            }
          });

        const deduplicatedAttendees: Character[] = [];

        // For each player, only include the character who actually attended
        attendees.forEach((attendee) => {
          if (
            !deduplicatedAttendees.some(
              (character) => character.player?.id === attendee.player?.id
            )
          ) {
            deduplicatedAttendees.push(attendee);
          }
        });

        const dungeonMaster = parsedPlayers.find(
          (player) =>
            player.id ===
            matchingsessionInterests.find(
              (interest) =>
                interest.sessionId === session.key &&
                interest.role === SessionRole["Dungeon Master"]
            )?.playerId
        );

        const matchingMap = parsedMaps.find((map) => map.id === session.mapId);

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
          attendees: deduplicatedAttendees,
          map: matchingMap,
        };
      })
      .sort((a, b) => (a.date && b.date ? b.date - a.date : -1));

    dispatch({
      type: "SetSessions",
      sessions: { isLoading: false, data: parsedSessions },
    });
  }, [
    dispatch,
    characters,
    characterClasses,
    characterRaces,
    raceConfigs,
    classConfigs,
    races,
    subraces,
    classes,
    subclasses,
    sessions,
    sessionInterests,
    players,
    maps,
  ]);

  return (
    <Stack
      verticalFill
      horizontal
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          overflowY: "auto",
          height: "100%",
          padding: "1em",
          backgroundColor: "white",
        },
      }}
    >
      <Pivot>
        <PivotItem headerText="Characters">
          <CharacterTable />
        </PivotItem>
        <PivotItem headerText="Sessions">
          <SessionTable />
        </PivotItem>
      </Pivot>
      <Stack>
        <Profile />
        <Utilities />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
