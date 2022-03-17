import { Artificer } from "./Classes/Artificer";
import { Barbarian } from "./Classes/Barbarian";
import { Bard } from "./Classes/Bard";
import { BloodHunter } from "./Classes/BloodHunter";
import { Cleric } from "./Classes/Cleric";
import { Druid } from "./Classes/Druid";
import { Fighter } from "./Classes/Fighter";
import { Monk } from "./Classes/Monk";
import { Paladin } from "./Classes/Paladin";
import { Ranger } from "./Classes/Ranger";
import { Rogue } from "./Classes/Rogue";
import { Sorcerer } from "./Classes/Sorcerer";
import { Warlock } from "./Classes/Warlock";
import { Wizard } from "./Classes/Wizard";

export default interface ICharacterData {
  id: number;
  key: string;
  avatarUrl: string;
  sheetUrl: string | undefined;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: {
    class:
      | Artificer
      | Barbarian
      | Bard
      | BloodHunter
      | Cleric
      | Druid
      | Fighter
      | Monk
      | Paladin
      | Ranger
      | Rogue
      | Sorcerer
      | Warlock
      | Wizard;
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
