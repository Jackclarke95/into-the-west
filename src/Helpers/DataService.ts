import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { push, ref, set, update, remove } from "firebase/database";
import { Session } from "../Types/LocalStructures";
import { auth, db } from "../App";
import SessionRole from "../Enums/SessionRole";
import { SessionInterestData } from "../Types/DatabaseStructures";
import { Map } from "../Types/LocalStructures";
import { Player } from "../Types/LocalStructures";
import { toast } from "react-toastify";

export default class DataService {
  public static generateKey(): string | null {
    const testRef = ref(db, "test");

    const key = push(testRef).key;

    return key;
  }

  /**
   * Creates a session in the Firebase Realtime Database
   * @param sessionName The name of the session
   * @param mapId The ID of the map of the session

   */
  public static createSession = async (
    sessionName: string,
    map: Map,
    player: Player
  ) => {
    const sessionsRef = ref(db, "sessions/");

    const sessionToAdd = {
      title: sessionName,
      mapId: map.id,
      suggestedByPlayerId: player.id,
    };

    await push(sessionsRef, sessionToAdd);

    await DataService.sendNewSessionToDiscord(sessionName, map);
  };

  public static registerForSession = async (
    session: Session,
    player: Player,
    role: SessionRole
  ) => {
    const sessionInterestsRef = ref(db, "sessionInterests/");

    const newSessionInterest = {
      sessionId: session.id,
      playerId: player.id,
      role: SessionRole[role],
    };

    await push(sessionInterestsRef, newSessionInterest);
  };

  public static unregisterFromSession = async (
    sessionInterest: SessionInterestData
  ) => {
    const sessionInterestRef = ref(
      db,
      "sessionInterests/" + sessionInterest.key
    );

    await remove(sessionInterestRef);
  };

  public static setDateForSession = async (session: Session, date: number) => {
    const sessionRef = ref(db, "sessions/" + session.id);

    await update(sessionRef, {
      selectedDate: date,
    });
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
   * @param email The email of the user
   * @param password The password of the user
   * @param name The name of the user
   */
  public static registerWithEmailAndPassword = async (
    email: string,
    password: string,
    name: string
  ) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("SUCCESS");
        // Signed in
        const user = userCredential.user;

        console.log(user);

        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            console.log("updated display name");
          })
          .catch((error) => {
            console.log("Error occurred updating display name", error);
          });

        DataService.createPlayer(user.uid, name);
      })
      .catch((error) => {
        console.log("Error signing up", error);

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
    const userAvailableDatesRef = ref(
      db,
      "/players/" + user.uid + "/availableDates/"
    );

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
   * @param userId The ID of the user to create a player record for
   * @param name The name of the player
   */
  public static createPlayer = async (userId: string, name: string) => {
    const usersRef = ref(db, "players/" + userId);

    await set(usersRef, { name: name }).then((result) =>
      console.log({ result })
    );
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
        const user = userCredential.user;

        console.log(user);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  /**
   * Signs the user out
   */
  public static signOut = async () => {
    signOut(auth)
      .then(() => {
        toast.success("Successfully signed out");
      })
      .catch((error) => {
        toast.error("could not sign out", error);
      });

    window.location.reload();
  };

  public static sendNewSessionToDiscord(sessionName: string, map: Map) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (webhookUrl) {
      const request = new XMLHttpRequest();

      request.open("POST", webhookUrl);
      request.setRequestHeader("Content-Type", "application/json");

      const params = {
        username: "Westhaven Guildmaster",
        content: `The session "${sessionName}" has been suggested for ${map.name}! Visit the https://into-the-west.co.uk to sign up!`,
      };

      request.send(JSON.stringify(params));
    } else {
      toast.error("Could not find Webhook URL to post message in Discord");
    }
  }
}
