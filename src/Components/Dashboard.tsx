import { Pivot, PivotItem, Stack } from "@fluentui/react";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";
import Profile from "./Profile/Profile";
import Utilities from "./Utilities/Utilities";
import NewCharacterTable from "./Tables/NewCharacterTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SessionRole from "../Enums/SessionRole";
import NewSessionTable from "./Tables/NewSessionTable";
import { Character, Session, Player } from "../Types/LocalStructures";
import DataService from "../Helpers/DataService";

const Dashboard = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.players);

  const newCharacters = useSelector((state) => state.newCharacters);
  const characterClasses = useSelector((state) => state.characterClasses);
  const characterRaces = useSelector((state) => state.characterRaces);
  const raceConfigs = useSelector((state) => state.raceConfigs);
  const classConfigs = useSelector((state) => state.classConfigs);
  const races = useSelector((state) => state.races);
  const subraces = useSelector((state) => state.subraces);
  const classes = useSelector((state) => state.classes);
  const subclasses = useSelector((state) => state.subclasses);

  const events = useSelector((state) => state.events);
  const eventInterests = useSelector((state) => state.eventInterests);

  useEffect(() => {
    if (
      newCharacters.isLoading ||
      characterClasses.isLoading ||
      characterRaces.isLoading ||
      raceConfigs.isLoading ||
      classConfigs.isLoading ||
      races.isLoading ||
      subraces.isLoading ||
      classes.isLoading ||
      subclasses.isLoading ||
      events.isLoading ||
      eventInterests.isLoading ||
      users.isLoading
    ) {
      return;
    }

    const parsedPlayers: Player[] = users.data.map((player) => {
      const attendedPlayerSessions = eventInterests.data
        .filter((eventInterest) => eventInterest.playerId === player.key)
        .map((interest) => {
          const session = events.data.find(
            (event) => event.key === interest.eventId
          );

          if (!session) {
            throw new Error(
              `Could not find matching session for event interest ${interest.key}`
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

      const unattendedSessions = events.data.filter(
        (event) =>
          !attendedPlayerSessions.some((session) => session.id === event.key)
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
      type: "SetParsedPlayers",
      parsedPlayers: { isLoading: false, data: parsedPlayers },
    });

    const parsedCharacters: Character[] = newCharacters.data.map(
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
      }
    );

    dispatch({
      type: "SetParsedCharacters",
      parsedCharacters: { isLoading: false, data: parsedCharacters },
    });

    const parsedSessions: Session[] = events.data
      .map((event) => {
        const matchingEventInterests = eventInterests.data.filter(
          (interest) =>
            interest.eventId === event.key && interest.didAttend === true
        );

        const attendees = matchingEventInterests.flatMap((interest) =>
          parsedCharacters.filter(
            (character) =>
              interest.role === SessionRole.Player &&
              character.player?.id === interest.playerId
          )
        );

        const dungeonMaster =
          matchingEventInterests.flatMap((interest) =>
            parsedPlayers.find(
              (user) =>
                interest.role === SessionRole["Dungeon Master"] &&
                user.id === interest.playerId
            )
          )[0] ?? undefined;

        return {
          id: event.key,
          name: event.title,
          dungeonMaster: dungeonMaster,
          date: event.selectedDate,
          attendees: attendees,
        };
      })
      .sort((a, b) => (a.date && b.date ? b.date - a.date : 0));

    dispatch({
      type: "SetParsedSessions",
      parsedSessions: { isLoading: false, data: parsedSessions },
    });
  }, [
    dispatch,
    newCharacters,
    characterClasses,
    characterRaces,
    raceConfigs,
    classConfigs,
    races,
    subraces,
    classes,
    subclasses,
    events,
    eventInterests,
    users,
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
          <NewCharacterTable />
        </PivotItem>
        <PivotItem headerText="Sessions">
          <NewSessionTable />
        </PivotItem>
        <PivotItem headerText="Characters (Legacy)">
          <CharacterTable />
        </PivotItem>
        <PivotItem headerText="Sessions (Legacy)">
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
