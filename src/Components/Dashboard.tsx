import { Pivot, PivotItem, Stack } from "@fluentui/react";
import CharacterTable from "./Tables/CharacterTable";
import SessionTable from "./Tables/SessionTable";
import Profile from "./Profile/Profile";
import Utilities from "./Utilities/Utilities";
import NewCharacterTable from "./Tables/NewCharacterTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import IParsedUser from "../Interfaces/Parsed/IParsedUser";
import SessionRole from "../Enums/SessionRole";
import IParsedCharacter from "../Interfaces/Parsed/IParsedCharacter";
import NewSessionTable from "./Tables/NewSessionTable";

const Dashboard = () => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users);

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
      console.log("Loading...");

      return;
    }

    console.log("Loaded");

    const parsedUsers = users.data.map((user) => {
      const attendedUserSessions = eventInterests.data
        .filter((eventInterest) => eventInterest.userId === user.key)
        .map((interest) => {
          const session = events.data.find(
            (event) => event.key === interest.eventId
          );

          if (!session) {
            return null;
          }

          return {
            id: session.key,
            name: session.title,
            date: new Date(session.selectedDate),
            role: interest.role,
          };
        })
        .filter((session) => session !== null);

      const earnedXp = attendedUserSessions.reduce((total, currentSession) => {
        if (currentSession.role === SessionRole.Player) {
          return total + 60;
        } else {
          return total + 30;
        }
      }, 0);

      const unattendedUserSessions = events.data.filter(
        (event) =>
          !attendedUserSessions.map((session) => session.id).includes(event.key)
      );

      const passiveXp = unattendedUserSessions.length * 12;

      const totalXp = earnedXp + passiveXp;

      return {
        availableDates: user.availableDates.map((date) => new Date(date)),
        discordTag: user.discordTag,
        id: user.key,
        isGamesMaster: user.isGamesMaster,
        isDungeonMaster: user.isDungeonMaster,
        name: user.name,
        attendedSessions: attendedUserSessions,
        characterLevel: Math.floor(totalXp / 120),
        xp: totalXp,
      } as IParsedUser;
    });

    dispatch({
      type: "SetParsedUsers",
      parsedUsers: { isLoading: false, data: parsedUsers },
    });

    const parsedCharacters = newCharacters.data.map((character) => {
      // Parse character's race
      const matchingCharacterRace = characterRaces.data.find(
        (race) => race.characterId === character.key
      );

      const matchingRaceConfig = raceConfigs.data.find(
        (config) => config.key === matchingCharacterRace.raceConfigId
      );

      const matchingRace = races.data.find(
        (race) => race.key === matchingRaceConfig.raceId
      );

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

          const matchingClass = classes.data.find(
            (cls) => cls.key === matchingClassConfig.classId
          );

          const matchingSubclass = subclasses.data.find(
            (subClass) => subClass.key === matchingClassConfig.subclassId
          );

          return {
            level: matchedCharacterClass.level as number,
            class: matchingClass.name as string,
            subclass: matchingSubclass.name as string | undefined,
          };
        });

      // Parse character's owner/user
      const matchingUser = parsedUsers.find(
        (user) => user.id === character.userId
      );

      const sessionsPlayed =
        matchingUser?.attendedSessions.filter(
          (interest) => interest.role === SessionRole.Player
        ).length ?? 0;

      return {
        id: character.key,
        user: matchingUser,
        name: character.name,
        nickname: character.nickname ?? undefined,
        race: parsedRace,
        classes: parsedClasses,
        sessionCount: sessionsPlayed,
        startingLevel: character.startingLevel,
        currentLevel: matchingUser?.characterLevel,
        avatarUrl: character.avatarUrl,
        retirement: character.retirement,
        sheetUrl: character.sheetUrl,
      } as IParsedCharacter;
    });

    dispatch({
      type: "SetParsedCharacters",
      parsedCharacters: { isLoading: false, data: parsedCharacters },
    });

    console.log({ parsedCharacters });

    const parsedSessions = events.data
      .map((event) => {
        const matchingEventInterests = eventInterests.data.filter(
          (interest) =>
            interest.eventId === event.key && interest.didAttend === true
        );

        console.log(event.key, event.title);

        const attendees = matchingEventInterests.map((interest) =>
          newCharacters.data.filter(
            (character) =>
              interest.role === SessionRole.Player &&
              character.userId === interest.userId
          )
        );

        console.log("attendeed", attendees);

        const dungeonMaster =
          matchingEventInterests.map((interest) =>
            parsedUsers.find(
              (user) =>
                interest.role === SessionRole["Dungeon Master"] &&
                user.id === interest.userId
            )
          )[0] ?? null;

        return {
          name: event.title,
          dungeonMaster: dungeonMaster,
          date: event.selectedDate,
          attendees: attendees,
        };
      })
      .sort((a, b) => b.date - a.date);

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
        <PivotItem headerText="New Characters">
          <NewCharacterTable />
        </PivotItem>
        <PivotItem headerText="New Sessions">
          <NewSessionTable />
        </PivotItem>
        <PivotItem headerText="Characters">
          <CharacterTable />
        </PivotItem>
        <PivotItem headerText="Sessions">
          <SessionTable />
        </PivotItem>
      </Pivot>
      {/* <SessionTable />
        <CharacterTable /> */}
      <Stack>
        <Profile />
        <Utilities />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
