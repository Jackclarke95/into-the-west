import { getId } from "@fluentui/react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { push, ref, update } from "firebase/database";

import { db } from "../App";
import ICharacterData from "../Interfaces/ICharacterData";
import ISessionData from "../Interfaces/ISessionData";

export default class DataService {
  /**
   * Creates a character in the Firebase Realtime Database
   * @param character The character to create
   */
  public static createCharacter = (character: ICharacterData) => {
    const charactersRef = ref(db, "characters");

    let characterToCreate = {
      id: getId("character-"),
      avatarUrl: "",
      sheetUrl: "",
      playerDndBeyondName: character.playerDndBeyondName,
      name: character.name,
      race: character.race,
      classes: character.classes,
      currentLevel: character.currentLevel,
      sessionsAttended: 0,
      startingLevel: character.startingLevel,
    };

    character.nickname &&
      Object.defineProperty(characterToCreate, "nickname", {
        value: character.nickname,
      });

    character.subrace &&
      Object.defineProperty(characterToCreate, "subrace", {
        value: character.subrace,
      });

    push(charactersRef, characterToCreate);
  };

  /**
   * Creates a session in the Firebase Realtime Database
   * @param name The name of the session
   * @param dungeonMaster The DnD Beyond name of the DM
   * @param map The map of the session
   * @param date The date of the session
   * @param attendees The list of attendees to the session
   */
  public static createSession = (
    name: string,
    dungeonMaster: string,
    map: string,
    date: string,
    attendees: number[]
  ) => {
    const sessionsRef = ref(db, "sessions/");

    const sessionToCreate = {
      id: getId("session-"),
      name,
      dungeonMaster,
      map,
      date,
      attendees,
    };

    push(sessionsRef, sessionToCreate);
  };

  /**
   * Signs a character up to a session
   * @param session The session to sign up tp
   * @param character The character with whom to sign up
   */
  public static signUpToSession = (
    session: ISessionData,
    character: ICharacterData
  ) => {
    if (!session.key) {
      throw new Error("Could not update Session; no key provided");
    }
    const sessionsRef = ref(db, "sessions/" + session.key);

    update(sessionsRef, {
      attendees: session.attendees.concat(character.id),
    });
  };

  /**
   * Removes a character from a session
   * @param session The session from which to remove the character
   * @param character The character to remove
   */
  public static removeCharacterFromSession = (
    session: ISessionData,
    character: ICharacterData
  ) => {
    if (!session.key) {
      throw new Error("Could not update Session; no key provided");
    }
    const sessionsRef = ref(db, "sessions/" + session.key);

    update(sessionsRef, {
      attendees: session.attendees.filter(
        (attendee) => attendee !== character.id
      ),
    });
  };

  /**
   * Retires a given character with a given reason, updating data in the Firebase Realtime Database
   * @param character The character to reason
   * @param reason The reason for the character's retirement
   */
  public static retireCharacter = (
    character: ICharacterData,
    reason: string
  ) => {
    if (!character.key) {
      throw new Error("Could not update character; no key provided");
    }

    const charactersRef = ref(db, "characters/" + character.key);

    update(charactersRef, {
      retirement: { reason: reason, date: new Date().toISOString() },
    });
  };

  public static createUser = (
    email: string,
    discordName: string,
    dndBeyondName: string,
    friendlyName: string,
    isDungeonMaster: boolean,
    isGamesMaster: boolean
  ) => {
    const usersRef = ref(db, "users/");

    const userToCreate = {
      id: getId("user-"),
      email,
      discordName,
      dndBeyondName,
      friendlyName,
      isDungeonMaster,
      isGamesMaster,
    };

    push(usersRef, userToCreate);
  };

  public static registerWithEmailAndPassword = (
    email: string,
    password: string,
    friendlyName: string,
    discordName: string,
    dndBeyondName: string,
    isDungeonMaster: boolean,
    isGamesMaster: boolean
  ) => {
    console.log(
      email,
      password,
      discordName,
      dndBeyondName,
      friendlyName,
      isDungeonMaster,
      isGamesMaster
    );

    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        console.log(user);

        DataService.createUser(
          email,
          discordName,
          dndBeyondName,
          friendlyName,
          isDungeonMaster,
          isGamesMaster
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  public static logInWithEmailAndPassword = (
    email: string,
    password: string
  ) => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };

  public static signOut = () => {
    signOut(getAuth())
      .then(() => {
        // Sign-out successful.
        console.log("successfully signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log("could not sign out", error);
      });

    window.location.reload();
  };
}
