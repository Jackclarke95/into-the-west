import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from "firebase/auth";
import { push, ref, set, update } from "firebase/database";

import { auth, db } from "../App";
import ICharacter from "../Interfaces/ICharacter";
import ICharacterData from "../Interfaces/ICharacterData";
import IPlayerData from "../Interfaces/IPlayerData";
import ISession from "../Interfaces/ISession";
import ISessionData from "../Interfaces/ISessionData";

export type UserData = {
  email: string;
  password: string;
  name: string;
  dndBeyondName: string;
  discordTag: string;
  isDungeonMaster: boolean;
  isGamesMaster: boolean;
};

export default class DataService {
  /**
   * Creates a character in the Firebase Realtime Database
   * @param character The character to create
   */
  public static createCharacter = (character: ICharacterData) => {
    const charactersRef = ref(db, "characters");

    let characterToCreate = {
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
   * @param attendees The list of attendees to the session
   * @param date The date of the session
   */
  public static createSession = (session: ISessionData) => {
    const sessionsRef = ref(db, "sessions/");

    push(sessionsRef, session);
  };

  /**
   * Signs a character up to a session
   * @param session The session to sign up tp
   * @param character The character with whom to sign up
   */
  public static signUpToSession = (
    session: ISession,
    character: ICharacter
  ) => {
    if (!session.key) {
      throw new Error("Could not update Session; no key provided");
    }
    const sessionsRef = ref(db, "sessions/" + session.key);

    update(sessionsRef, {
      attendees: session.attendees.concat(character.key),
    });
  };

  /**
   * Removes a character from a session
   * @param session The session from which to remove the character
   * @param character The character to remove
   */
  public static removeCharacterFromSession = (
    session: ISession,
    character: ICharacter
  ) => {
    if (!session.key) {
      throw new Error("Could not update Session; no key provided");
    }

    const sessionsRef = ref(db, "sessions/" + session.key);

    update(sessionsRef, {
      attendees: session.attendees.filter(
        (attendee) => attendee !== character.key
      ),
    });
  };

  /**
   * Retires a given character with a given reason, updating data in the Firebase Realtime Database
   * @param character The character to reason
   * @param reason The reason for the character's retirement
   */
  public static retireCharacter = (character: ICharacter, reason: string) => {
    if (!character.key) {
      throw new Error("Could not update character; no key provided");
    }

    const charactersRef = ref(db, "characters/" + character.key);

    update(charactersRef, {
      retirement: { reason: reason, date: new Date().toISOString() },
    });
  };

  /**
   * Registers a Firebase user and creates a player record in the Firebase Realtime Database
   * @param userData Data about the user to register
   */
  public static registerWithEmailAndPassword = (userData: UserData) => {
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        console.log(user);

        const uid = user.uid;

        const playerToCreate = {
          email: userData.email,
          name: userData.name,
          discordTag: userData.discordTag,
          dndBeyondName: userData.dndBeyondName,
          isDungeonMaster: userData.isDungeonMaster,
          isGamesMaster: userData.isGamesMaster,
        } as IPlayerData;

        DataService.createPlayer(uid, playerToCreate);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error);
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  /**
   * Changes a user's password
   * @param user The user whose password to change
   * @param password The password to change to
   * @returns Result of the password change
   */
  public static changePassword = async (user: User, password: string) => {
    return await updatePassword(user, password)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log({ error });
        throw new Error(error);
      });
  };

  /**
   * Resets a user's password
   * @param auth The Firebase auth object
   * @param email The email of the user to reset
   * @returns Response of the Firebase password reset
   */
  public static resetPassword = async (auth: Auth, email: string) => {
    return sendPasswordResetEmail(auth, email)
      .then((response) => {
        console.log("response", response);

        return response;
      })
      .catch((error) => {
        console.log("error", error);
        console.log("error message", error.message);

        throw new Error(error.message);
      });
  };

  /**
   * Creates a player record in the Firebase Realtime Database
   * @param player The player record to create
   */
  public static createPlayer = async (uid: string, player: IPlayerData) => {
    const usersRef = ref(db, "players/" + uid);

    await set(usersRef, player).then((result) => console.log({ result }));
  };

  /**
   * Updates a player record in the Firebase Realtime Database
   * @param uid The unique ID of the player
   * @param data The key value pairs of the player to update
   */
  public static updatePlayer = async (
    uid: string,
    data: { key: string; value: string }[]
  ) => {
    const usersRef = ref(db, "players/" + uid);

    await update(usersRef, data);
  };

  /**
   * Logs the user in with their email address and password
   * @param email The user's email address
   * @param password The user's password
   */
  public static logInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    console.log("signing in");

    return await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error({ errorCode }, { errorMessage });

        throw new Error(errorMessage);
      });
  };

  /**
   * Signs the user out
   */
  public static signOut = () => {
    signOut(auth)
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
