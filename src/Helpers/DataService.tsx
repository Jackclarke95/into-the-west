import ICharacterData from "../Interfaces/ICharacterData";
import ISessionData from "../Interfaces/ISessionData";
import { firebaseDb } from "../firebase.utils";

export const createCharacter = (character: ICharacterData) => {
  if (window.confirm(`Create new Character?`)) {
    firebaseDb
      .child(`characters/`)
      .push(character)
      .catch((error) =>
        alert(
          `Failed to create Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${error}`
        )
      );
  }
};

export const createSession = (session: ISessionData) => {
  firebaseDb
    .child(`sessions/`)
    .push(session)
    .catch((e) => alert(`Failed to create Session.\n\nDetails:\n${e}`));
};
