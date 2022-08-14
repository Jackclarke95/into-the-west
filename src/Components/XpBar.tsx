import { Character } from "../Types/LocalStructures";
import LevelUpData from "../Data/LevelUp";

/** XP bar component, displaying a character's progress to the next level */
const XpBar: React.FC<{
  character: Character;
}> = ({ character }) => {
  // Find the class with the highest level
  const mainClass = character.classes.reduce((currentClass, prevClass) => {
    if (currentClass.level > prevClass.level) {
      return currentClass;
    } else {
      return prevClass;
    }
  }, character.classes[0]);

  const characterXp = character.player?.xp ?? 0;

  const achievedLevels = LevelUpData.filter(
    (level) => characterXp >= level.xpRequired
  );

  const currentLevel = LevelUpData[achievedLevels.length - 1];
  const nextLevel = LevelUpData[achievedLevels.length];

  const xpForCurrent = currentLevel.xpRequired;
  const xpForNext = nextLevel.xpRequired;

  const xpBetweenLevels = xpForNext - xpForCurrent;
  const xpIntoCurrentLevel = characterXp - xpForCurrent;
  const xpPercentage = (xpIntoCurrentLevel / xpBetweenLevels) * 100;

  return (
    <div className="xp-bar-container">
      <div
        className="xp-bar"
        title={`${xpIntoCurrentLevel} / ${xpBetweenLevels} XP`}
      >
        <div
          className="progress"
          data-class-name={mainClass.class}
          style={{
            width: `${xpPercentage}%`,
          }}
        />
      </div>
      <div className="xp-description">{`${xpIntoCurrentLevel}/${xpBetweenLevels}`}</div>
    </div>
  );
};

export default XpBar;
