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
import { PlayerDataToCreate, SessionData } from "../Types/DatabaseStructures";

export default class DataService {
  public static generateKey(): string | null {
    const testRef = ref(db, "test");

    const key = push(testRef).key;

    return key;
  }

  /**
   * Creates a session in the Firebase Realtime Database
   * @param name The name of the session
   * @param dungeonMaster The DnD Beyond name of the DM
   * @param map The map of the session
   * @param attendees The list of attendees to the session
   * @param date The date of the session
   */
  public static createSession = (session: SessionData) => {
    const sessionsRef = ref(db, "sessions/");

    push(sessionsRef, session);
  };

  /**
   * Creates a race in the Firebase Realtime Databse
   * @param name The name of the new race
   * @param subraceRequired Whether the new race requires a subrace
   */
  public static createRace = (name: string, subraceRequired: boolean) => {
    const racesRef = ref(db, "races/");

    const race = { name: name, subraceRequired: subraceRequired };

    return push(racesRef, race)
      .then((response) => response)
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  /**
   * Registers a Firebase user and creates a player record in the Firebase Realtime Database
   * @param userData Data about the user to register
   */
  public static registerWithEmailAndPassword = async (userData) => {
    return createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )
      .then((userCredential) => {
        console.log("SUCCESS");
        // Signed in
        const user = userCredential.user;
        // ...

        console.log(user);

        const playerToCreate = {
          discordTag: userData.discordTag,
          name: userData.name,
          isDungeonMaster: userData.isDungeonMaster,
          isGamesMaster: userData.isGamesMaster,
          availableDates: [],
        } as PlayerDataToCreate;

        DataService.createPlayer(user.uid, playerToCreate);
      })
      .catch((error) => {
        console.log("ERROR");

        throw new Error(error.message);
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
        console.log("error:", { error });

        throw new Error(error);
      });
  };

  public static updateAvailableDates = async (
    user: User,
    availableDates: number[]
  ) => {
    console.log("updating available dates", user.uid, availableDates);

    const userAvailableDatesRef = ref(
      db,
      "/users/" + user.uid + "/availableDates/"
    );

    console.log(userAvailableDatesRef);

    await set(userAvailableDatesRef, availableDates);
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
  public static createPlayer = async (
    userId: string,
    player: PlayerDataToCreate
  ) => {
    const usersRef = ref(db, "players/" + userId);

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
        throw new Error(error.message);
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
