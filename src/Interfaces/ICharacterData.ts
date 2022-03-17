import { Artificer } from "./Classes/Artificer";
import { Barbarian } from "./Classes/Barbarian";
import { Bard } from "./Classes/Bard";
import { BloodHunter } from "./Classes/BloodHunter";

export default interface ICharacterData {
  id: number;
  avatarUrl: string;
  sheetUrl: string | undefined;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: {
    class: Artificer | Barbarian | Bard | BloodHunter;
    level: number;
  }[];
  currentLevel: number;
  sessionsAttended: number;
  startingLevel: number;
  retirement: {
    reason: string;
    date: string;
  };
}
