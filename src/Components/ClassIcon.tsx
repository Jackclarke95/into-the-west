import ArtificerIcon from "../Images/ClassIcons/Artificer.jpeg";
import BarbarianIcon from "../Images/ClassIcons/Barbarian.jpeg";
import BardIcon from "../Images/ClassIcons/Bard.jpeg";
import BloodHunter from "../Images/ClassIcons/BloodHunter.jpeg";
import ClericIcon from "../Images/ClassIcons/Cleric.jpeg";
import DruidIcon from "../Images/ClassIcons/Druid.jpeg";
import FighterIcon from "../Images/ClassIcons/Fighter.jpeg";
import MonkIcon from "../Images/ClassIcons/Monk.jpeg";
import PaladinIcon from "../Images/ClassIcons/Paladin.jpeg";
import RangerIcon from "../Images/ClassIcons/Ranger.jpeg";
import RogueIcon from "../Images/ClassIcons/Rogue.jpeg";
import SorcererIcon from "../Images/ClassIcons/Sorcerer.jpeg";
import WarlockIcon from "../Images/ClassIcons/Warlock.jpeg";
import WizardIcon from "../Images/ClassIcons/Wizard.jpeg";

const ClassIcon: React.FC<{
  className: string;
}> = ({ className }) => {
  const classIcons = {
    Artificer: ArtificerIcon,
    Barbarian: BarbarianIcon,
    Bard: BardIcon,
    "Blood Hunter": BloodHunter,
    Cleric: ClericIcon,
    Druid: DruidIcon,
    Fighter: FighterIcon,
    Monk: MonkIcon,
    Paladin: PaladinIcon,
    Ranger: RangerIcon,
    Rogue: RogueIcon,
    Sorcerer: SorcererIcon,
    Warlock: WarlockIcon,
    Wizard: WizardIcon,
  };

  return (
    <img
      className="class-icon"
      src={classIcons[className]}
      alt={`${className} Icon`}
    />
  );
};

export default ClassIcon;
